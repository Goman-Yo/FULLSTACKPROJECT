import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import './AboutPage.css';

function AboutPage() {
  const [profile, setProfile] = useState(null); // State for the user's main profile info
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, educationData, experienceData, skillsData] = await Promise.all([
          authenticatedFetch('/profile'), // Fetch profile data
          authenticatedFetch('/education'),
          authenticatedFetch('/experience'),
          authenticatedFetch('/skills')
        ]);

        setProfile(profileData);
        setEducation(educationData);
        setExperience(experienceData);
        setSkills(skillsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const skillCategories = skills.reduce((acc, skill) => {
  const category = skill.category || 'General';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(skill);
  return acc; // This line was missing
}, {});
  if (isLoading) return <div className="page-loading">Loading...</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="about-page">
      {/* Section 1: Personal Introduction - NOW DYNAMIC */}
      <section className="about-intro-section page-section">
        <div className="container">
          {/* Display dynamic headline and sub-headline */}
          <h2>{profile?.headline || "Your Headline Here"}</h2>
          <p className="intro-text">{profile?.sub_headline || "Your detailed bio will appear here once you update it in the admin dashboard."}</p>
        </div>
      </section>

      {/* Section 2: Education & Professional Experience (dynamic content) */}
      <section className="education-experience-section page-section dark-section">
        <div className="container">
          <div className="ed-ex-grid">
            {education.length > 0 && education.map(edu => (
              <div key={edu.id} className="education-card">
                <h3>Education</h3>
                <h4>{edu.degree}</h4>
                <p className="university-name">{edu.institution_name}</p>
                <p className="graduation-date">Expected Graduation: {edu.expected_graduation_date}</p>
                <ul><li>{edu.highlights}</li></ul>
              </div>
            ))}
            
            {experience.length > 0 && experience.map(exp => (
              <div key={exp.id} className="experience-card">
                <h3>Professional Experience</h3>
                <h4>{exp.job_title}</h4>
                <p className="company-name">{exp.company_name}</p>
                <ul><li>{exp.description}</li></ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: My Skillset (dynamic content) */}
      <section className="skillset-section page-section">
        <div className="container">
          <h2>My Skillset</h2>
          <div className="skills-container">
            {Object.entries(skillCategories).map(([category, skillsList]) => (
              <div key={category} className="skill-category">
                <h3>{category}</h3>
                <div className="skills-list">
                  {skillsList.map(skill => (
                    <span key={skill.id} className="skill-tag">
                      {skill.name}
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