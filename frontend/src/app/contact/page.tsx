'use client';

import { FormEvent, useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending…");
    setTimeout(() => {
      setStatus("✅ Message sent. We’ll be in touch soon!");
    }, 600);
  };

  return (
    <div className="container contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>
          Have a question or want to explore how Gen&nbsp;AI can level‑up your
          institution? Fill out the form and our team will reach out within
          one business day.
        </p>
      </header>

      <form onSubmit={handleSubmit} ref={undefined} className="contact-form">
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Work email" required />
        <textarea name="message" rows={5} placeholder="How can we help?" required />
        <button type="submit" className="btn-primary">
          Send Message
        </button>
      </form>

      {status && <p className="status-text">{status}</p>}

      <p className="disclaimer">
        We respect your privacy — your information will only be used to
        respond to this inquiry.
      </p>
    </div>
  );
}
