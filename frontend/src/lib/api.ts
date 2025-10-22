// src/lib/api.ts
const API_BASE = "http://127.0.0.1:8000";
// const API_BASE = "";
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;

  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) {
    isRefreshing = false;
    throw new Error("no refresh token");
  }

  refreshPromise = fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh }),
  })
    .then(async (r) => {
      if (!r.ok) throw new Error("refresh denied");
      const data = await r.json();
      if (data.access) {
        localStorage.setItem("accessToken", data.access);
        // optional: sync across tabs
        try {
          new BroadcastChannel("auth").postMessage({
            type: "access-updated",
            access: data.access,
          });
        } catch {}
      } else {
        throw new Error("no access in response");
      }
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const doFetch = () =>
    fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, {
      ...init,
      headers,
    });

  let res = await doFetch();

  if (res.status === 401 && localStorage.getItem("refreshToken")) {
    try {
      await refreshAccessToken();
      const newToken = localStorage.getItem("accessToken");
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }
      res = await doFetch();
    } catch {
      // hard logout on refresh denial
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loggedIn");
      try {
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "logout" });
        bc.close();
      } catch {}
      window.dispatchEvent(new Event("storage"));
      throw new Error("Session expired");
    }
  }

  return res;
}
