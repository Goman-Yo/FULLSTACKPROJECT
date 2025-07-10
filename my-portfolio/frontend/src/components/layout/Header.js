// src/components/layout/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Changed from Link to NavLink
import './Header.css'; // Import the CSS file for the header

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="site-title">
          <NavLink to="/">Yosef Dabous</NavLink> {/* Your name linking to home */}
        </div>
        <nav className="main-navigation">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Gallery</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;