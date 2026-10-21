import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PageStyles.css';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.success) {
         localStorage.setItem('userId', data.user._id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
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
            <Link to="/home" className="btn btn-outline-light btn-sm rounded-pill px-3 me-2">Login</Link>
            <Link to="/signup" className="btn btn-light btn-sm rounded-pill px-3">Sign Up</Link>
          </div>
        </div>
      </nav>
      <div className="auth-box text-white">
        <h2 className="fw-bold mb-4">Create Your Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="auth-input"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" className="btn btn-light w-100 mt-3 rounded-pill fw-semibold">Sign Up</button>
        </form>
        <p className="mt-3 mb-0 text-center">
          Already have an account? <Link to="/" className="text-warning">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
