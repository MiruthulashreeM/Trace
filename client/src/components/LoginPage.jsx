import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PageStyles.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
       localStorage.setItem('userId', data.user._id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="overlay-page">
      <nav className="navbar navbar-expand-lg navbar-dark transparent-navbar position-absolute w-100 py-3">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-3" to="/">Trace</Link>
          <div className="ms-auto">
            <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill px-3 me-2">Login</Link>
            <Link to="/signup" className="btn btn-light btn-sm rounded-pill px-3">Sign Up</Link>
          </div>
        </div>
      </nav>
      <div className="auth-box text-white">
        <h2 className="fw-bold mb-4">Welcome Back to Trace</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-light w-100 mt-3 rounded-pill fw-semibold">Login</button>
        </form>
        <p className="mt-3 mb-0 text-center">
          Don't have an account? <Link to="/signup" className="text-warning">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
