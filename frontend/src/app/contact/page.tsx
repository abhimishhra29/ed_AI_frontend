'use client';

import { useState } from 'react';

// Generate time slots in 30-minute intervals (24-hour format)
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots: { value: string; display: string }[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push({
      value: `${hour.toString().padStart(2, '0')}:00`,
      display: `${hour.toString().padStart(2, '0')}:00`
    });
    
    if (hour < endHour) {
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:30`,
        display: `${hour.toString().padStart(2, '0')}:30`
      });
    }
  }
  return slots;
};

const morningSlots = generateTimeSlots(10, 13); // 10 AM to 1 PM
const eveningSlots = generateTimeSlots(15, 19); // 3 PM to 7 PM

export default function Contact() {
  const [status, setStatus] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending…");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Add selected time to form data if available
    if (selectedTime) {
      formData.append('preferred_time', selectedTime);
    }

    const res = await fetch("https://formspree.io/f/mkgbryqz", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (res.ok) {
      setStatus("Message sent. We'll be in touch soon!");
      form.reset();
      setSelectedTime("");
    } else {
      setStatus("Something went wrong. Try again.");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Open Calendly in a new window with the selected time
    window.open(`https://calendly.com/abhi291097/30min?date=${new Date().toISOString().split('T')[0]}&hour=${time}`, '_blank');
  };

  return (
    <div className="contact-page-wrapper">
      <div className="container contact-page">
        <h1 className="contact-title">Get in Touch with Us</h1>

        <div className="contact-content">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input 
                type="text" 
                name="name" 
                placeholder="Input your name" 
                required 
                className="form-input"
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Input your email" 
                required 
                className="form-input"
              />
            </div>
            
            <input 
              type="text" 
              name="subject" 
              placeholder="Subject" 
              required 
              className="form-input form-input-full"
            />
            
            <textarea 
              name="message" 
              rows={5} 
              placeholder="Submit your message request" 
              required 
              className="form-input form-input-full form-textarea"
            />

            <button type="submit" className="btn-send-message">
              Send message
            </button>
          </form>

          {status && <p className="status-text">{status}</p>}

          <div className="appointment-section">
            <h2 className="appointment-title">Schedule an Appointment</h2>
            <p className="appointment-description">
              Select a time slot to book your 30-minute appointment.
            </p>
            
            <div className="time-slots-container">
              <div className="time-section">
                <h3 className="time-section-title">MORNING</h3>
                <div className="time-slots-grid">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      className={`time-slot-btn ${selectedTime === slot.value ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(slot.value)}
                    >
                      {slot.display}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-section">
                <h3 className="time-section-title">EVENING</h3>
                <div className="time-slots-grid">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      className={`time-slot-btn ${selectedTime === slot.value ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(slot.value)}
                    >
                      {slot.display}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedTime && (
              <p className="selected-time-info">
                Selected: {morningSlots.find(s => s.value === selectedTime)?.display || eveningSlots.find(s => s.value === selectedTime)?.display} - Opening booking page...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
