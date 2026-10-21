import React from "react";
import "./about.css";
import { Home } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      {/* 🏠 Fixed Home Icon */}
      <div
        style={{
          position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "10px",
    borderRadius: "999px",
    backdropFilter: "blur(8px)"
        }}
      >
        <a href="/home" title="Home">
          <Home size={28} className="text-white" />
        </a>
      </div>

      {/* 🔵 Main Content */}
      <div className="overlay">
        <header>
          <h1>ABOUT US</h1>
          <h2>Trace is a journey inward, guiding you outward</h2>
        </header>

        <section className="card">
          <h2>Why Trace?</h2>
          <p>
            Have you ever returned from a trip feeling like something was missing?
            <br />
            That’s because most travel apps recommend places — we recommend{" "}
            <strong>purpose</strong>.
            <br />
            <br />
            <strong>Trace</strong> is built on the belief that every person deserves to explore
            places that reflect their soul. We use psychology, culture, and local secrets to
            create something magical — a match between your personality and the spirit of Tamil Nadu.
          </p>
        </section>

        <section className="card">
          <h2>Who We Are</h2>
          <p>
            We are a group of explorers, students, and storytellers who noticed something:
            Tamil Nadu holds thousands of beautiful stories, forgotten temples, quiet rivers,
            and ancient rocks waiting to be rediscovered — not just by tourists, but by the
            right person.
            <br />
            <br />
            With <strong>Trace</strong>, we connect your personality with a spiritual,
            historical, or natural match — places that feel like a missing piece of your soul.
          </p>
        </section>

        <section className="card">
          <h2>Our Vision</h2>
          <p>
            In a world of noise and fast travel, we dream of <strong>meaningful discovery</strong>.
            <br />
            We envision Trace as a peaceful path for those who want to explore slowly,
            mindfully, and with purpose.
            <br />
            <br />
            Hidden waterfalls. Forgotten village shrines. Sunset cliffs only locals know.
            <strong>
              {" "}
              You’re not just visiting — you’re returning to a place your soul remembers.
            </strong>
          </p>
        </section>

        <section className="card">
          <h2>What Makes Us Different</h2>
          <p>
            While most platforms guide you to the <em>popular</em>, we guide you to the{" "}
            <em>personal</em>.
            <br />
            No ratings. No crowd-favorites. No commercial filters.
            <br />
            <strong>Trace</strong> uses the unseen — your mindset, your rhythm, your inner
            landscape — to suggest places that feel like they were waiting for you.
            <br />
            Think of us as a compass for your soul, not just your GPS.
            <br />
            <em>
              Because the journey isn’t about the map — it’s about the mirror it holds up to you.
            </em>
          </p>
        </section>

        <footer>
          &copy; 2025 Trace – Your Traits, Your Trail | Crafted with ❤️ for soulful explorers
        </footer>
      </div>
    </>
  );
};

export default AboutUs;
