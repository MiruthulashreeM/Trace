import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

function HomePage() {
  // Get user name from localStorage if available
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user ? user.name : 'Guest';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-page enhanced-home-bg">
      <div className="overlay enhanced-overlay"></div>

      {/* Sidebar Toggle Button and Brand */}
      <div style={{ position: 'fixed', top: 24, left: 24, zIndex: 30, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{ background: 'rgba(30,60,114,0.85)', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', color: '#fff', display: sidebarOpen ? 'none' : 'block' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className="brand-title" style={{ fontWeight: 700, fontSize: '1.7rem', letterSpacing: '2px', color: '#fff', textShadow: '0 2px 8px rgba(30,60,114,0.18)',marginLeft: '55px' }}>    TRACE</span>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="sidebar" style={{ zIndex: 40 }}>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
          >
            &times;
          </button>
          <div className="sidebar-title ">Trace</div>
          <div className="sidebar-user">Hello, {userName}</div>
          
          <a href="/explore" className="sidebar-link">Explore</a>
          <a href="/about" className="sidebar-link">About us</a>
          <a href="/contact" className="sidebar-link">Contact us</a>
          {/* Add more links as needed */}
        </aside>
      )}

      <div className="container hero-content d-flex flex-column align-items-center justify-content-center text-center">
        
        <h1 className="display-3 fw-bold mb-3 gradient-text">Let Your Traits<br />Trace The Trail</h1>
        <p className="lead mb-4">Discover places that truly match your personality<br />Take the quiz now!</p>
        <button className="start-journey-btn" style={{marginTop: '2.5rem', marginBottom: '2.5rem'}} onClick={() => { navigate('/quiz') }}>
          Start My Journey
        </button>
        <div className="row g-4 mt-5 justify-content-center feature-row">
          <div className="col-md-3 feature-card shadow-sm rounded-4 p-4 mx-2">
            
            <p className="text-muted">Discover Hidden Gems Uniquely Meant For You</p>
          </div>
          <div className="col-md-3 feature-card shadow-sm rounded-4 p-4 mx-2">
            <p className="fw-semibold">Trait-Based Guide Your Mind,Travel Aligned With Who You Are</p>
          </div>
          <div className="col-md-3 feature-card shadow-sm rounded-4 p-4 mx-2">
            <h4 className="fw-semibold text-muted">Seamless Exploration, Plan With Ease, Travel With Meaning</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
