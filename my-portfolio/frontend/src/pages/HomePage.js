// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import profileImage from '../assets/images/My_image.jpg';
import featuredProjectImage from '../assets/images/ai-image-detection.jpg'; // Ensure this image exists

const PlaceholderIcon = ({ D = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '15px' }}>
    <path d={D}></path>
  </svg>
);

function HomePage() {
  const skills = [
    // ... (your existing skills array - keep as is)
    {
      icon: <PlaceholderIcon D="M21 6.5c0-.83-.67-1.5-1.5-1.5H16V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4.5C3.67 5 3 5.67 3 6.5S3.67 8 4.5 8H10v2H4.5C3.67 10 3 10.67 3 11.5S3.67 13 4.5 13H10v2H4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H10v2c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2h3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H16v-2h3.5c.83 0 1.5-.67 1.5-1.5S20.17 13 19.5 13H16v-2h3.5c.83 0 1.5-.67 1.5-1.5z" />,
      title: "Data Engineering",
      description: "Building scalable data pipelines and robust ETL processes to transform raw data into actionable insights.",
      tooltipText: "Expertise in designing, constructing, and maintaining data architectures."
    },
    {
      icon: <PlaceholderIcon D="M11.45 5.28c-.3-.22-.72-.22-.99 0L5.5 9.19L4.22 7.64c-.39-.39-1.02-.39-1.41 0L1.4 9.05c-.39.39-.39 1.02 0 1.41l3.28 3.28c.39.39 1.02.39 1.41 0l6.78-7.04c.32-.33.29-.86-.04-1.16l-.79-.62zM19.5 9.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
      title: "AI & Machine Learning",
      description: "Developing and training AI models to extract insights, predict outcomes, and drive intelligent automation.",
      tooltipText: "Skilled in various ML algorithms, model training, and AI application development."
    },
    {
      icon: <PlaceholderIcon D="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8h16v9c0 .55-.45 1-1 1zM7 10.5C7 11.33 6.33 12 5.5 12S4 11.33 4 10.5 4.67 9 5.5 9s1.5.67 1.5 1.5z" />,
      title: "Full-Stack Development",
      description: "Crafting seamless user experiences with expertise in both frontend and backend technologies.",
      tooltipText: "Comfortable working across the entire stack, from UI to databases."
    },
    {
      icon: <PlaceholderIcon D="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />,
      title: "Python Programming",
      description: "Leveraging Python for data analysis, AI/ML development, backend services, and automation.",
      tooltipText: "Extensive experience with Python and its rich ecosystem of libraries."
    }
  ];

  const featuredProject = {
    title: "AI-Generated Image Detection Model", // Slightly shortened title
    description: "Contributed to developing an advanced AI model at CopyLeaks to distinguish AI-generated from human-created images, involving large-scale data handling, multi-model image generation via GPU infrastructure, and rigorous training.",
    // Updated technologies to be an array of objects for tooltips
    technologies: [
      { name: "Python", tip: "Primary language for scripting, data processing, and model interaction." },
      { name: "Deep Learning (PyTorch/TensorFlow)", tip: "Utilized for building and training neural network architectures." },
      { name: "Computer Vision (OpenCV)", tip: "Applied for image manipulation, feature extraction, and analysis tasks." },
      { name: "GPU Computing (CUDA)", tip: "Leveraged for accelerated training of complex deep learning models." }
    ],
    imageUrl: featuredProjectImage,
    link: "/projects"
  };

  return (
    <div className="home-page">
      {/* Hero Section (keep as is) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Yosef Dabous: Data Engineer & Computer Science Innovator</h1>
          <p className="sub-headline">
            Final year Computer Science student at Tel Hai University and Data Engineer at CopyLeaks, 
            passionate about leveraging data to build innovative AI solutions.
          </p>
          <div className="hero-cta-buttons">
            <Link to="/projects" className="cta-button primary">View My Projects</Link>
            <Link to="/about" className="cta-button secondary">About Me</Link>
            <a 
              href={"/documents/Yosef_Dabous_Resume.pdf"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button secondary" // Can use existing style or create a new one
            >
              View Resume
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={profileImage} alt="Yosef Dabous" className="profile-image" />
        </div>
      </section>

      {/* Key Skills Section (keep as is) */}
      <section className="key-skills-section">
        <h2>My Core Expertise</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div 
              key={skill.title} 
              className="skill-card" 
              title={skill.tooltipText}
            >
              <div className="skill-icon">{skill.icon}</div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Project Section - MODIFIED */}
      <section className="featured-project-section">
        <h2>Featured Project</h2>
        <div className="project-showcase">
          <div className="project-image-container">
            {featuredProject.imageUrl ? (
              <img src={featuredProject.imageUrl} alt={featuredProject.title} className="project-image" />
            ) : (
              <div className="project-image-placeholder">Project Image Here</div>
            )}
          </div>
          {/* This 'project-details' div will now get the dark background */}
          <div className="project-details"> 
            <h3>{featuredProject.title}</h3>
            <p className="project-description">{featuredProject.description}</p>
            <div className="project-technologies">
              <strong>Key Technologies Used:</strong> {/* Changed text slightly */}
              <ul>
                {featuredProject.technologies.map(tech => (
                  <li key={tech.name} title={tech.tip}>{tech.name}</li> /* Added title attribute for tooltip */
                ))}
              </ul>
            </div>
            <Link to={featuredProject.link} className="cta-button project-cta">Learn More</Link> {/* Added specific class for styling if needed */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;