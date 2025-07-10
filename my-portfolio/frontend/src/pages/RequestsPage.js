// frontend/src/pages/RequestsPage.js
import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import './RequestsPage.css';

function RequestsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const data = await authenticatedFetch('/contact-submissions');
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

 const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        // We will call the API but we don't need to read the response body
        const response = await fetch(`http://localhost:5000/api/contact-submissions/${id}`, {
          method: 'DELETE',
          headers: {
            // We still need to send the token for authentication
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
            // If the server sent an error, try to read it as JSON
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete message');
        }

        // If deletion was successful (e.g., status 204), just refresh the list
        fetchSubmissions();
        
      } catch (err) {
        // Catch errors from the network or from the errorData above
        alert(`Failed to delete message: ${err.message}`);
      }
    }
  };
  
  const handleMarkAsReplied = async (id) => {
     try {
        await authenticatedFetch(`/contact-submissions/${id}/reply`, {
          method: 'PUT',
        });
        // Refresh the list to show the updated status
        fetchSubmissions();
      } catch (err) {
        alert(`Failed to mark as replied: ${err.message}`);
      }
  };

  if (isLoading) return <div className="page-loading">Loading requests...</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="page-section container">
      <h2 className="requests-page-title">Contact Form Submissions</h2>
      <div className="submissions-container">
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          submissions.map(submission => (
            <div key={submission.id} className={`submission-card ${submission.replied ? 'replied' : ''}`}>
              <div className="submission-header">
                <div>
                    <p><strong>From:</strong> {submission.sender_name} (<a href={`mailto:${submission.sender_email}`}>{submission.sender_email}</a>)</p>
                    <p><strong>Subject:</strong> {submission.subject}</p>
                </div>
                {submission.replied && <span className="replied-status">Replied ✔</span>}
              </div>
              <div className="submission-body">
                <p>{submission.message}</p>
              </div>
              <div className="submission-footer">
                <span>Received: {new Date(submission.received_at).toLocaleString()}</span>
                <div className="submission-actions">
                  {!submission.replied && (
                    <>
                      <a href={`mailto:${submission.sender_email}?subject=Re: ${submission.subject}`} className="action-button reply">Reply</a>

                      {/* --- ADD THIS BUTTON --- */}
                      <button onClick={() => handleMarkAsReplied(submission.id)} className="action-button mark-replied">
                        Mark as Replied
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(submission.id)} className="action-button delete">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RequestsPage;