// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css';

// This logic determines which URL to use based on the environment
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the dynamic BASE_URL to build the request URL
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // If login is successful
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Use navigate to go to the homepage instead of a full page reload
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to manage your portfolio.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-footer">
            <button type="submit" className="cta-button primary login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;