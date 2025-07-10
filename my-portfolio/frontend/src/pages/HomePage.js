// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// נתקן את נתיבי התמונות כך שיצביעו לשרת ה-Backend
const profileImageUrl = 'http://localhost:5000/images/My_image.jpg';
const featuredProjectImageUrl = 'http://localhost:5000/images/ai-image-detection.jpg';

// ... (PlaceholderIcon component נשאר כמו שהוא)
const PlaceholderIcon = ({ D = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '15px' }}>
    <path d={D}></path>
  </svg>
);

function HomePage() {
  // State עבור הכישורים
  const [skills, setSkills] = useState([]);
  // אפשר להוסיף גם state לטעינה ושגיאות אם רוצים, כמו שעשינו בעמוד הפרויקטים

  // useEffect שיביא את הכישורים מה-API
    useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        
        // כאן התיקון: אנחנו מחפשים את השמות המדויקים מתוך בסיס הנתונים
        const featuredSkillNames = [
          "Data Engineering", 
          "AI Model Training & Development", 
          "Frontend Development (React, HTML, CSS)", 
          "Python" // השם בבסיס הנתונים הוא "Python", לא "Python Programming"
        ];

        const featuredSkills = data.filter(skill => 
          featuredSkillNames.includes(skill.name)
        );

        setSkills(featuredSkills);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // המידע על הפרויקט המוצג יכול גם להגיע מה-API, כרגע נשאיר אותו סטטי לדוגמה
  const featuredProject = {
    title: "AI-Generated Image Detection Model",
    description: "Contributed to developing an advanced AI model at CopyLeaks...",
    technologies: [
      { name: "Python", tip: "Primary language for scripting..." },
      { name: "Deep Learning (PyTorch/TensorFlow)", tip: "Utilized for building..." },
      { name: "Computer Vision (OpenCV)", tip: "Applied for image manipulation..." },
      { name: "GPU Computing (CUDA)", tip: "Leveraged for accelerated training..." }
    ],
    link: "/projects"
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
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
              href="/documents/Yosef_Dabous_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button secondary"
            >
              View Resume
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={profileImageUrl} alt="Yosef Dabous" className="profile-image" />
        </div>
      </section>

      {/* Key Skills Section - עכשיו דינמי */}
      <section className="key-skills-section">
        <h2>My Core Expertise</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.id} className="skill-card" title={skill.name}>
              <div className="skill-icon"><PlaceholderIcon /></div>
              <h3>{skill.name}</h3>
              {/* התיאור והטולטיפ יצטרכו להגיע מה-DB אם נרצה, כרגע השארנו את זה פשוט */}
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Project Section */}
      <section className="featured-project-section">
        <h2>Featured Project</h2>
        <div className="project-showcase">
          <div className="project-image-container">
            <img src={featuredProjectImageUrl} alt={featuredProject.title} className="project-image" />
          </div>
          <div className="project-details"> 
            <h3>{featuredProject.title}</h3>
            <p className="project-description">{featuredProject.description}</p>
            <div className="project-technologies">
              <strong>Key Technologies Used:</strong>
              <ul>
                {featuredProject.technologies.map(tech => (
                  <li key={tech.name} title={tech.tip}>{tech.name}</li>
                ))}
              </ul>
            </div>
            <Link to={featuredProject.link} className="cta-button project-cta">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;