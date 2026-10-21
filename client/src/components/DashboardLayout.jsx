import React from 'react';
import './PageStyles.css';
import { Link } from 'react-router-dom';

function DashboardLayout({ children, showSidebar, toggleSidebar, user }) {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'visible' : ''}`}>
        <h2>Welcome, {user ? user.email : 'User'}</h2>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>

      {/* Topbar */}
      <div className="topbar">
        <button className="menu-icon" onClick={toggleSidebar}>
          {showSidebar ? '✖' : '☰'}
        </button>
        <Link to="/" className="brand"><i className="bi bi-send"></i> Trace</Link>
        <div className="topbar-right">{user ? user.email : ''}</div>
      </div>

      {/* Page Content */}
      <div className="page-content" onClick={() => showSidebar && toggleSidebar()}>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
