// src/pages/ContactPage.js
import React, { useState } from 'react';
import './ContactPage.css'; // We'll create this CSS file next

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Something went wrong. Please try again later.');
    }

    // אם הבקשה הצליחה
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' }); // איפוס הטופס

  } catch (error) {
    console.error('Failed to send message:', error);
    alert(error.message);
  }
};


  const contactLinks = [
    {
      name: "LinkedIn",
      iconText: "LI", // Placeholder for icon
      url: "https://www.linkedin.com/in/yosef-dabous-632754303",
      ariaLabel: "Connect with Yosef Dabous on LinkedIn"
    },
    {
      name: "GitHub",
      iconText: "GH", // Placeholder for icon
      url: "https://github.com/Goman-Yo",
      ariaLabel: "View Yosef Dabous's projects on GitHub"
    },
    {
      name: "Email",
      iconText: "EM", // Placeholder for icon
      url: "mailto:yosef123da@gmail.com",
      ariaLabel: "Send an email to Yosef Dabous"
    }
  ];

  return (
    <div className="contact-page page-section">
      <div className="container">
        <h2 className="contact-page-title">Let's Connect</h2>
        <p className="contact-intro">
          I'm always excited to discuss new opportunities, projects, or just chat about technology. 
          Please feel free to reach out!
        </p>

        <div className="contact-content-wrapper">
          <div className="contact-form-container">
            <h3>Send Me a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                ></textarea>
              </div>
              <button type="submit" className="cta-button primary form-submit-button">
                Send Message
              </button>
            </form>
          </div>

          <div className="direct-contact-container">
            <h3>Or Reach Me Directly</h3>
            <div className="contact-links-grid">
              {contactLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-icon-link"
                  aria-label={link.ariaLabel}
                  title={link.name} // For browser tooltip
                >
                  <span className="contact-icon-circle">{link.iconText}</span>
                  <span className="contact-icon-label">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;