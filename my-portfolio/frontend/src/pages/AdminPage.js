// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import './AdminPage.css';

// --- Helper function for image upload logic ---
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Image upload failed');
  }

  return response.json();
};


// --- FORM COMPONENT 1: Edit Profile ---
const EditProfileForm = () => {
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      let imageUrlToUpdate = null;
      if (profileImageFile) {
        const uploadResult = await uploadImage(profileImageFile);
        imageUrlToUpdate = uploadResult.imageUrl;
      }
      const profileData = { fullName, headline, subHeadline, profileImageUrl: imageUrlToUpdate };
      const updatedProfile = await authenticatedFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      setMessage('Profile updated successfully!');
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name !== updatedProfile.full_name) {
        user.name = updatedProfile.full_name;
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));
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
        <div className="form-group">
          <label>Profile Image</label>
          <input type="file" onChange={(e) => setProfileImageFile(e.target.files[0])} />
        </div>
        <button type="submit" className="cta-button primary">Update Profile</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};


// --- FORM COMPONENT 2: Add Project ---
const AddProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [liveLink, setLiveLink] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!projectImageFile) {
      setError('An image is required to add a project.');
      return;
    }
    try {
      const uploadResult = await uploadImage(projectImageFile);
      const imageUrl = uploadResult.imageUrl;
      const technologiesArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
      const projectData = {
        title,
        description,
        imageUrl,
        liveLink: liveLink || null,
        codeLink: codeLink || null,
        displayOrder: 99,
        technologies: technologiesArray,
      };
      const newProject = await authenticatedFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      setMessage(`Project "${newProject.title}" added successfully!`);
      setTitle('');
      setDescription('');
      setProjectImageFile(null);
      setLiveLink('');
      setCodeLink('');
      setTechnologies('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Add New Project</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Project Image</label>
          <input type="file" onChange={(e) => setProjectImageFile(e.target.files[0])} required />
        </div>
        <div className="form-group">
          <label>Live Link</label>
          <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Code Link</label>
          <input type="url" value={codeLink} onChange={(e) => setCodeLink(e.target.value)} />
        </div>
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


// --- FORM COMPONENT 3: Add Skill ---
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


// --- FORM COMPONENT 4: Add Education ---
const AddEducationForm = () => {
  const [institutionName, setInstitutionName] = useState('');
  const [degree, setDegree] = useState('');
  const [expectedGraduation, setExpectedGraduation] = useState('');
  const [highlights, setHighlights] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await authenticatedFetch('/education', {
        method: 'POST',
        body: JSON.stringify({ institutionName, degree, expectedGraduation, highlights }),
      });
      setMessage('Education record added successfully!');
      setInstitutionName('');
      setDegree('');
      setExpectedGraduation('');
      setHighlights('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Add Education Record</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Institution Name</label>
          <input type="text" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Degree</label>
          <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Expected Graduation</label>
          <input type="text" value={expectedGraduation} onChange={(e) => setExpectedGraduation(e.target.value)} placeholder="e.g., Early 2026" />
        </div>
        <div className="form-group">
          <label>Highlights</label>
          <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} />
        </div>
        <button type="submit" className="cta-button primary">Add Education</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};



// --- FORM COMPONENT 5: Add Experience ---
const AddExperienceForm = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await authenticatedFetch('/experience', {
        method: 'POST',
        body: JSON.stringify({ jobTitle, companyName, startDate, endDate, description }),
      });
      setMessage('Experience record added successfully!');
      setJobTitle('');
      setCompanyName('');
      setStartDate('');
      setEndDate('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-section">
      <h3>Add Experience Record</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Job Title</label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date (leave blank for present)</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="cta-button primary">Add Experience</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};


// --- MAIN ADMIN PAGE COMPONENT (with Tabs) ---
function AdminPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <EditProfileForm />;
      case 'projects':
        return <AddProjectForm />;
      case 'skills':
        return <AddSkillForm />;
      case 'education':
        return <AddEducationForm />;
      case 'experience':
        return <AddExperienceForm />;
      default:
        return <EditProfileForm />;
    }
  };

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="page-section container admin-dashboard">
      <div className="admin-header">
        <div className="welcome-message">
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {user.name}!</p>
        </div>
        <button onClick={handleLogout} className="cta-button secondary logout-button">Logout</button>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('profile')} className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}>Edit Profile</button>
        <button onClick={() => setActiveTab('projects')} className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}>Add Project</button>
        <button onClick={() => setActiveTab('skills')} className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}>Add Skill</button>
        <button onClick={() => setActiveTab('education')} className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}>Add Education</button>
        <button onClick={() => setActiveTab('experience')} className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}>Add Experience</button>
      </div>

      <div className="admin-content">
        {renderActiveTabContent()}
      </div>
    </div>
  );
}

export default AdminPage;