// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../api'; // Use our authenticated fetch function
import './HomePage.css';

const PlaceholderIcon = ({ D = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '15px' }}>
    <path d={D}></path>
  </svg>
);

function HomePage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [featuredProject, setFeaturedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, skillsData, projectsData] = await Promise.all([
          authenticatedFetch('/profile'),
          authenticatedFetch('/skills'),
          authenticatedFetch('/projects') // Fetch all projects to find the featured one
        ]);

        setProfile(profileData);

        const featuredSkillNames = ["Data Engineering", "AI Model Training & Development", "Frontend Development (React, HTML, CSS)", "Python"];
        const featuredSkills = skillsData.filter(skill => featuredSkillNames.includes(skill.name));
        setSkills(featuredSkills);
        
        // Find the first project to feature (or you can add a specific flag in your DB)
        if (projectsData && projectsData.length > 0) {
            setFeaturedProject(projectsData[0]);
        }

      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>{profile?.headline || "Loading..."}</h1>
          <p className="sub-headline">{profile?.sub_headline || ""}</p>
          <div className="hero-cta-buttons">
            <Link to="/projects" className="cta-button primary">View My Projects</Link>
            <Link to="/about" className="cta-button secondary">About Me</Link>
            <a href="/documents/Yosef_Dabous_Resume.pdf" target="_blank" rel="noopener noreferrer" className="cta-button secondary">
              View Resume
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          {profile?.profile_image_url && (
            <img src={profile.profile_image_url} alt={profile.full_name} className="profile-image" />
          )}
        </div>
      </section>

      {/* Key Skills Section */}
      <section className="key-skills-section">
        <h2>My Core Expertise</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.id} className="skill-card" title={skill.name}>
              <div className="skill-icon"><PlaceholderIcon /></div>
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Project Section */}
      {featuredProject && (
        <section className="featured-project-section">
          <h2>Featured Project</h2>
          <div className="project-showcase">
            <div className="project-image-container">
              <img src={featuredProject.image_url} alt={featuredProject.title} className="project-image" />
            </div>
            <div className="project-details">
              <h3>{featuredProject.title}</h3>
              <p className="project-description">{featuredProject.description}</p>
              <div className="project-technologies">
                <strong>Key Technologies Used:</strong>
                <ul>
                  {featuredProject.technologies.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
              <Link to="/projects" className="cta-button project-cta">Learn More</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;