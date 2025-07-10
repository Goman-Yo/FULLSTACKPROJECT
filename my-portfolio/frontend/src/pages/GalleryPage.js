// frontend/src/pages/GalleryPage.js
import React, { useState, useEffect } from 'react';
import './GalleryPage.css';

// --- GalleryItem Component (Manages its own comment input state) ---
function GalleryItem({ itemData, onLike, onAddComment, onToggleComments }) {
  const [commenterName, setCommenterName] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!commenterName.trim() || !commentText.trim()) {
      alert("Please enter both your name and comment.");
      return;
    }
    // קורא לפונקציה מההורה שתשלח את התגובה לשרת
    onAddComment(itemData.id, { name: commenterName.trim(), text: commentText.trim() });
    setCommenterName('');
    setCommentText('');
  };

  return (
    <div className="gallery-item-card">
      <div className="gallery-image-container">
        {/* בניית כתובת התמונה המלאה שמצביעה לשרת ה-backend */}
        <img src={`http://localhost:5000/images/gallery/${itemData.image_url}`} alt={itemData.alt || itemData.caption} className="gallery-image" />
      </div>
      {itemData.caption && <p className="gallery-caption">{itemData.caption}</p>}
      
      <div className="gallery-item-interactions">
        <button 
          onClick={() => onLike(itemData.id)} 
          className={`like-button ${itemData.likedByUser ? 'liked' : ''}`} // likedByUser יעודכן בעתיד
          aria-pressed={itemData.likedByUser}
          title="Like"
        >
          <span className="heart-icon">{itemData.likedByUser ? '❤️' : '🤍'}</span> 
          <span className="like-count">{itemData.likes}</span>
        </button>
        <button onClick={() => onToggleComments(itemData.id)} className="comments-toggle-button">
          {itemData.showComments ? 'Hide' : 'Show'} Comments ({itemData.comments.length})
        </button>
      </div>

      {itemData.showComments && (
        <div className="comments-section">
          <form onSubmit={handleCommentFormSubmit} className="comment-form">
            <h4>Add a Comment</h4>
            <div className="form-group">
              <label htmlFor={`name-${itemData.id}`}>Name:</label>
              <input 
                type="text" 
                id={`name-${itemData.id}`} 
                name="commenterName"
                value={commenterName} 
                onChange={(e) => setCommenterName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor={`comment-${itemData.id}`}>Comment:</label>
              <textarea 
                id={`comment-${itemData.id}`} 
                name="commentText"
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                rows="3" 
                required
              ></textarea>
            </div>
            <button type="submit" className="cta-button primary small">Post Comment</button>
          </form>
          <div className="comments-list">
            {itemData.comments.length > 0 ? (
              itemData.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.name}:</strong>
                  <p>{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments-yet">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- GalleryPage Component (Manages the overall gallery state via API calls) ---
function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // מוסיפים לכל פריט את השדה showComments עבור ניהול תצוגה בצד הלקוח
        const initialItems = data.map(item => ({ ...item, showComments: false }));
        setGalleryItems(initialItems);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryData();
  }, []);

  const handleLike = async (itemId) => {
  // נמצא את הפריט הספציפי במערך כדי לדעת אם המשתמש כבר עשה לו לייק
  const currentItem = galleryItems.find(item => item.id === itemId);
  if (!currentItem) return;

  const action = currentItem.likedByUser ? 'unlike' : 'like';

  // 1. עדכון אופטימי של הממשק - נותן תגובה מיידית למשתמש
  setGalleryItems(currentItems =>
    currentItems.map(item =>
      item.id === itemId ? { 
        ...item, 
        likes: item.likedByUser ? item.likes - 1 : item.likes + 1, 
        likedByUser: !item.likedByUser 
      } : item
    )
  );

  // 2. שליחת הבקשה לשרת כדי לעדכן את בסיס הנתונים
  try {
    const response = await fetch(`http://localhost:5000/api/gallery/${itemId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: action }), // שולחים את הפעולה הרצויה
    });

    if (!response.ok) {
      // אם השרת נכשל, נבטל את העדכון האופטימי (נחזיר את המצב לקדמותו)
      throw new Error('Server failed to update likes');
    }
    // אין צורך לעדכן את ה-state שוב, כי כבר עשינו זאת אופטימית.

  } catch (error) {
    console.error("Error liking image:", error);
    // במקרה של שגיאה, נחזיר את המצב לקדמותו כדי שה-UI ישקף את המציאות
    setGalleryItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { 
          ...item, 
          likes: currentItem.likes, // מחזירים לספירה המקורית
          likedByUser: currentItem.likedByUser // מחזירים למצב הלייק המקורי
        } : item
      )
    );
    alert('Failed to update like. Please try again.');
  }
};

  const handleAddComment = async (itemId, newComment) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${itemId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const addedComment = await response.json();

      // עדכון ה-state בצד הלקוח עם התגובה החדשה שהתקבלה מהשרת
      setGalleryItems(currentItems =>
        currentItems.map(item =>
          item.id === itemId ? { ...item, comments: [addedComment, ...item.comments] } : item
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleToggleComments = (itemId) => {
    setGalleryItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, showComments: !item.showComments } : item
      )
    );
  };

  if (isLoading) return <div className="page-loading">Loading Gallery...</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="gallery-page page-section">
      <div className="container">
        <h2 className="gallery-page-title">My Gallery</h2>
        <p className="gallery-intro">
          A collection of moments, interests, and things that inspire me.
        </p>
        <div className="gallery-grid">
          {galleryItems.map(item => (
            <GalleryItem 
              key={item.id} 
              itemData={item}
              onLike={handleLike}
              onAddComment={handleAddComment}
              onToggleComments={handleToggleComments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;