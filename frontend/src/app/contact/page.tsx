'use client';

import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending…");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("https://formspree.io/f/mkgbryqz", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (res.ok) {
      setStatus("Message sent. We’ll be in touch soon!");
      form.reset();
    } else {
      setStatus("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>
          Have a question or want to explore how Gen&nbsp;AI can level-up your
          institution? Fill out the form and our team will reach out within
          one business day.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" name="name" placeholder="Your name" required />
        <input type="email" name="email" placeholder="Work email" required />
        <input type="text" name="institution" placeholder="Institution" required />
        <textarea name="message" rows={5} placeholder="How can we help?" required />

        <button type="submit" className="btn-primary">
          Send Message
        </button>
      </form>

      {status && <p className="status-text">{status}</p>}

      <p className="disclaimer">
        We respect your privacy — your information will only be used to
        respond to this inquiry.
      </p>
    </div>
  );
}
