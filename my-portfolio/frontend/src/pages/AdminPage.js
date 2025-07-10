// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import './AdminPage.css'; // We'll create this CSS file

const AddProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [technologies, setTechnologies] = useState(''); // New state for technologies
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Split the comma-separated string into an array
    const technologiesArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);

    const projectData = {
      title,
      description,
      imageUrl: `/images/${imageUrl}`,
      liveLink: liveLink || null,
      codeLink: codeLink || null,
      displayOrder: 99,
      technologies: technologiesArray, // Send the array to the backend
    };

    try {
      const newProject = await authenticatedFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      setMessage(`Project "${newProject.title}" added successfully!`);
      // Clear form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLiveLink('');
      setCodeLink('');
      setTechnologies(''); // Clear technologies field
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Add New Project</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        {/* ... other form groups for title, description, etc. ... */}
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image Filename</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="e.g., my-project.jpg" />
        </div>
        <div className="form-group">
          <label>Live Link</label>
          <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Code Link</label>
          <input type="url" value={codeLink} onChange={(e) => setCodeLink(e.target.value)} />
        </div>

        {/* New form group for technologies */}
        <div className="form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="e.g., React, Node.js, PostgreSQL" />
        </div>

        <button type="submit" className="cta-button primary">Add Project</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};
// NEW COMPONENT: EditProfileForm
const EditProfileForm = () => {
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the current profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authenticatedFetch('/profile');
        setFullName(data.full_name || '');
        setHeadline(data.headline || '');
        setSubHeadline(data.sub_headline || '');
      } catch (err) {
        setError('Could not load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updatedProfile = await authenticatedFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName, headline, subHeadline }),
      });
      setMessage('Profile updated successfully!');
      // Also update the user's name in localStorage if it changed
      const user = JSON.parse(localStorage.getItem('user'));
      if(user.name !== updatedProfile.full_name) {
          user.name = updatedProfile.full_name;
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event("storage")); // Notify header of change
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Edit Profile Information</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Headline (from Homepage)</label>
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Sub-Headline / Bio (from About Page)</label>
          <textarea value={subHeadline} onChange={(e) => setSubHeadline(e.target.value)} required rows="5" />
        </div>
        <button type="submit" className="cta-button primary">Update Profile</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};
const AddSkillForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const newSkill = await authenticatedFetch('/skills', {
        method: 'POST',
        body: JSON.stringify({ name, category }),
      });
      setMessage(`Skill "${newSkill.name}" added successfully!`);
      // Clear form
      setName('');
      setCategory('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Add New Skill</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Skill Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Docker" />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g., Development & Tools" />
        </div>
        <button type="submit" className="cta-button primary">Add Skill</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

function AdminPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) {
    // This part can be removed since we use ProtectedRoute, but it's good for clarity
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="page-section container">
      <div className="admin-header">
        <h2>Welcome, {user.name}!</h2>
        <button onClick={handleLogout} className="cta-button secondary">Logout</button>
      </div>
      <p>This is your admin dashboard. From here, you can manage your portfolio content.</p>
      <EditProfileForm />
      <AddProjectForm />
      <AddSkillForm />
      {/* We will add components to edit/delete projects later */}
    </div>
  );
}

export default AdminPage;