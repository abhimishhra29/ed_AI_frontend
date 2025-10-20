// src/lib/api.ts

// ============================================================================
// 🎭 MOCK MODE CONFIGURATION
// ============================================================================
// Set to 'true' to work WITHOUT backend (for UI development & demos)
// Set to 'false' when backend is ready and you want to connect to real APIs
// ============================================================================
const MOCK_MODE = true; // ← CHANGE THIS TO false WHEN BACKEND IS READY!
// ============================================================================

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

  // ========================================================================
  // 🎭 MOCK MODE: Generate fake refresh token
  // ========================================================================
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Refreshing token (fake)");
    const mockAccess = "mock_refreshed_access_token_" + Date.now();
    localStorage.setItem("accessToken", mockAccess);
    try {
      new BroadcastChannel("auth").postMessage({
        type: "access-updated",
        access: mockAccess,
      });
    } catch {}
    isRefreshing = false;
    return Promise.resolve();
  }
  // ========================================================================
  // 🌐 REAL MODE: Actual token refresh from backend
  // ========================================================================

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

// ============================================================================
// 🎭 MOCK API RESPONSES (Used when MOCK_MODE = true)
// ============================================================================
function getMockResponse(path: string, init: RequestInit = {}): Response {
  const method = init.method || "GET";
  
  // Mock login endpoint
  if (path.includes("/token/") && method === "POST") {
    const mockData = {
      access: "mock_access_token_" + Date.now(),
      refresh: "mock_refresh_token_" + Date.now(),
      is_superuser: false,
      username: "demo_user",
      email: "demo@edgenai.com"
    };
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Mock token refresh endpoint
  if (path.includes("/token/refresh/") && method === "POST") {
    const mockData = {
      access: "mock_refreshed_access_token_" + Date.now()
    };
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Mock activity tracking endpoint
  if (path.includes("/api/activity/") && method === "POST") {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Mock workflow list endpoint
  if (path.includes("/api/v1/workflow/list/grade")) {
    const mockData = {
      workflows: ["auto_grade", "Assignment_grader", "handwritten_ocr"]
    };
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Default mock response for other endpoints
  return new Response(JSON.stringify({ 
    message: "Mock mode: Backend not connected",
    mock: true 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
// ============================================================================

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  // ========================================================================
  // 🎭 MOCK MODE: Return fake responses without calling real backend
  // ========================================================================
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Intercepting API call to", path);
    return getMockResponse(path, init);
  }
  // ========================================================================
  // 🌐 REAL MODE: Connect to actual backend (code below)
  // ========================================================================

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
      throw new Error("Session expired");
    }
  }

  return res;
}
