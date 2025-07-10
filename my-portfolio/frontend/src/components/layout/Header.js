// frontend/src/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    const handleStorageChange = () => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) setUser(JSON.parse(loggedInUser));
        else setUser(null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // We can navigate to login page after logout
    window.location.href = '/login';
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="site-title">
          {/* Display user name or Guest */}
          <NavLink to="/">{user ? `${user.name}'s Portfolio` : "Guest Portfolio"}</NavLink>
        </div>
        <nav className="main-navigation">
          <ul>
            {user ? (
              <>
                <li><NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink></li>
                <li><NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink></li>
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink></li>
                <li><NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Gallery</NavLink></li>
                <li><NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin</NavLink></li>
                <li><NavLink to="/requests" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Requests</NavLink></li>
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink></li>
                <li><NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Sign Up</NavLink></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
export default Header;