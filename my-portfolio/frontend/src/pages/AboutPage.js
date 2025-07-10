// src/pages/AboutPage.js
import React from 'react';
import './AboutPage.css';

function AboutPage() {
  const education = {
    // ... (keep existing education object)
    degree: "B.Sc. in Computer Science",
    university: "Tel Hai University",
    graduation: "Early 2026 (Expected)",
    highlights: [
      "Maintained an average grade of 93.",
      "Received an academic excellence award for the 2023/2024 year.",
    ]
  };

  const experience = {
    // ... (keep existing experience object)
    role: "Data Engineer (AI Team)",
    company: "CopyLeaks",
    contributions: [
      "Actively contributed to the development and refinement of AI models for both text and image-based AI-generated content detection.",
      "Engineered efficient data pipelines for large-scale data collection, processing, and analysis, crucial for model training and performance.",
      "Specialized in data tagging, meticulous data analysis, and implementing efficient methods for handling substantial datasets."
    ]
  };

  // NEW: Define your skill categories and skills
  const skillCategories = [
    {
      name: "Programming Languages",
      skills: ["Python", "JavaScript", "Java", "SQL", "C++", "C#", "C"]
    },
    {
      name: "Data & AI",
      skills: ["Data Engineering", "ETL Processes", "Data Pipelines", "Database Management (SQL & NoSQL)", "Pandas", "Polars", "PyTorch", "AI Model Training & Development", "Data Analysis"]
    },
    {
      name: "Cloud Platforms",
      skills: ["Google Cloud Platform (GCP)", "Oracle Cloud"]
    },
    {
      name: "Development & Tools",
      skills: ["Frontend Development (React, HTML, CSS)", "Backend Development", "Git & Version Control", "API Design", "Agile Methodologies"]
    }
    // You can add more categories or skills
  ];

  return (
    <div className="about-page">
      {/* Section 1: Personal Introduction (Light Background) - KEEP AS IS */}
      <section className="about-intro-section page-section">
        <div className="container">
          <h2>Hello! I'm Yosef Dabous...</h2>
          <p className="intro-text">
            A dedicated and high-achieving final-year Computer Science student at Tel Hai University, 
            expecting to graduate in early 2026 with an average of 93 and an excellence award for 
            the 2023/2024 academic year. My passion lies at the intersection of data engineering 
            and artificial intelligence. As a Data Engineer on the AI team at CopyLeaks, I'm 
            immersed in building and optimizing systems that power cutting-edge AI solutions, 
            from data pipelines to model development. I thrive on transforming complex data into 
            actionable intelligence and am driven to contribute to innovative technologies 
            that make a real impact.
          </p>
        </div>
      </section>

      {/* Section 2: Education & Professional Experience (Dark Background) - KEEP AS IS */}
      <section className="education-experience-section page-section dark-section">
        <div className="container">
          <div className="ed-ex-grid">
            <div className="education-card">
              <h3>Education</h3>
              <h4>{education.degree}</h4>
              <p className="university-name">{education.university}</p>
              <p className="graduation-date">Expected Graduation: {education.graduation}</p>
              <ul>
                {education.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="experience-card">
              <h3>Professional Experience</h3>
              <h4>{experience.role}</h4>
              <p className="company-name">{experience.company}</p>
              <ul>
                {experience.contributions.map((contribution, index) => (
                  <li key={index}>{contribution}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: My Skillset (Light Background) - MODIFIED */}
      <section className="skillset-section page-section">
        <div className="container">
          <h2>My Skillset</h2>
          <div className="skills-container">
            {skillCategories.map((category, index) => (
              <div key={index} className="skill-category">
                <h3>{category.name}</h3>
                <div className="skills-list">
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;