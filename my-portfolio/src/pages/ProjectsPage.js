// src/pages/ProjectsPage.js
import React from 'react';
import './ProjectsPage.css'; // We'll create this CSS file next

// Import project images - UPDATE THESE PATHS IF YOUR FILENAMES ARE DIFFERENT
import project1Image from '../assets/images/ai-image-detection.jpg';
import project2Image from '../assets/images/film-finder-ui.png';
import project3Image from '../assets/images/text-analysis-abstract.jpg';

const projectsData = [
  {
    id: 1,
    title: "AI-Generated Image Detection Model",
    imageUrl: project1Image,
    description: "Contributed to developing an advanced AI model at CopyLeaks to accurately distinguish AI-generated from human-created images, focusing on robust data handling and model training.",
    technologies: ["Python", "PyTorch", "Computer Vision (OpenCV)", "GPU Computing", "Data Pipelines"],
    liveLink: null, // No live link
    codeLink: null  // No code link
  },
  {
    id: 2,
    title: "CineScope - Film Discovery Hub",
    imageUrl: project2Image,
    description: "Developed a comprehensive Film Finder website for a web development course, allowing users to search for films, create accounts, manage favorite lists, and interact with content.",
    technologies: ["Node.js", "Express.js", "SQLite3", "HTML", "CSS", "JavaScript"],
    liveLink: null, // No live link
    codeLink: null  // No code link, as requested
  },
  {
    id: 3,
    title: "Advanced Text Tagging for Document Analysis",
    imageUrl: project3Image,
    description: "Engineered data preparation and text tagging solutions for a multilingual document analysis model. This involved utilizing LLMs (DeepSeek, LLaMA) to automatically tag text elements, coupled with intensive data cleaning using Polars.",
    technologies: ["Python", "Large Language Models (LLaMA, DeepSeek)", "Polars", "API Integration", "Data Cleaning"],
    liveLink: null, // No live link
    codeLink: null  // No code link
  }
  // Add more projects here as needed
];

function ProjectsPage() {
  return (
    <div className="projects-page page-section"> {/* Added page-section for consistent padding */}
      <div className="container">
        <h2 className="projects-page-title">My Projects</h2>
        <p className="projects-intro">
          Here's a selection of projects I've worked on, demonstrating my skills in data engineering, AI development, and web technologies.
        </p>
        <div className="projects-grid">
          {projectsData.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-card-image-container">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="project-card-image" />
                ) : (
                  <div className="project-card-image-placeholder">Image Coming Soon</div>
                )}
              </div>
              <div className="project-card-content">
                <h3>{project.title}</h3>
                <p className="project-card-description">{project.description}</p>
                <div className="project-card-technologies">
                  <strong>Technologies:</strong>
                  <ul>
                    {project.technologies.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
                <div className="project-card-links">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="cta-button project-link">
                      View Live
                    </a>
                  )}
                  {project.codeLink && (
                    <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="cta-button project-link secondary">
                      View Code
                    </a>
                  )}
                  {/* If no links, we can show a message or nothing */}
                  {!project.liveLink && !project.codeLink && (
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

export default ProjectsPage;