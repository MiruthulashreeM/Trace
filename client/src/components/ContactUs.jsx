import React from "react";
import "./ContactUs.css";
import { Home } from "lucide-react"; // ✅ Import Home icon

export default function ContactUs() {
  const formSubmitEndpoint = "https://formsubmit.co/ajax/5de9ac43bdedd8ec5d14febac8189352";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const formData = new FormData(form);
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Mail sent successfully");
        window.location.reload();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending the form. Try again later.");
    }
  };

  return (
    <div className="contact-page">
      {/* 🏠 Fixed Home Icon */}
      <div className="home-icon">
        <a href="/home" title="Home">
          <Home size={28} className="text-white" />
        </a>
      </div>

      <div className="overlay">
        <h1>Contact <span>TRACE</span></h1>
        <h4 className="subtext">
          We'd love to hear from you. Ask us anything or share ideas!
        </h4>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_subject" value="New message from TRACE website" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="box" />
          <input type="text" name="_honeypot" style={{ display: "none" }} />

          <label htmlFor="name">Your Name</label>
          <input id="name" name="name" type="text" required />

          <label htmlFor="email">Your Email</label>
          <input id="email" name="email" type="email" required />

          <label htmlFor="message">Your Message</label>
          <textarea id="message" name="message" required></textarea>

          <button type="submit">Send Message</button>
        </form>

        <footer>
          &copy; 2025 TRACE – Follow Your Traits. Find Your Trail.
        </footer>
      </div>
    </div>
  );
}
