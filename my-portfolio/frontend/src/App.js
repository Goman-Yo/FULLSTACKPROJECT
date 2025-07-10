// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Link is no longer needed here directly
import Header from './components/layout/Header'; // Import Header
import Footer from './components/layout/Footer'; // Import Footer
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Use the Header component */}

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </main>

        <Footer /> {/* Use the Footer component */}
      </div>
    </Router>
  );
}

export default App;