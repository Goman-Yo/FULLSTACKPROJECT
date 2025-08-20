// frontend/src/pages/ProjectsPage.js
import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api'; // Import our new function
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await authenticatedFetch('/projects');
        setProjects(data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) return <div className="page-loading">Loading projects...</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="projects-page page-section">
      <div className="container">
        <h2 className="projects-page-title">My Projects</h2>
        <p className="projects-intro">
          Here's a selection of projects I've worked on, demonstrating my skills in data engineering, AI development, and web technologies.
        </p>
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-card-image-container">
                <img src={project.image_url} alt={project.title} className="project-card-image" />
              </div>
              <div className="project-card-content">
                <h3>{project.title}</h3>
                <p className="project-card-description">{project.description}</p>
                <div className="project-card-technologies">
                  {/* Fetching technologies per project is a future step */}
                  <strong>Technologies:</strong>
                  <ul>{project.technologies && project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
                </div>
                <div className="project-card-links">
                  {project.live_link ? (
                    <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="cta-button project-link primary">
                      View Live
                    </a>
                  ) : null}
                  {project.code_link ? (
                    <a href={project.code_link} target="_blank" rel="noopener noreferrer" className="cta-button project-link secondary">
                      View Code
                    </a>
                  ) : null}
                  {!project.live_link && !project.code_link && (
                     <p className="no-links-message">(Internal/Proprietary Project)</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;