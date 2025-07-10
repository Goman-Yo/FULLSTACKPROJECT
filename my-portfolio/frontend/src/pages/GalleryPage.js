// src/pages/GalleryPage.js
import React, { useState } from 'react';
import './GalleryPage.css'; // Ensure this CSS file exists and is correctly styled

// STEP 1: REPLACE these placeholder imports with your actual image files
// from src/assets/images/gallery/
// Make sure the filenames and paths are 100% correct.
import personal1Img from '../assets/images/gallery/personal_1.jpg'; // Example placeholder
import personal2Img from '../assets/images/gallery/personal_2.jpg'; // Example placeholder
import personal3Img from '../assets/images/gallery/personal_3.jpg'; // Example placeholder
import personal4Img from '../assets/images/gallery/personal_4.jpg'; // Example placeholder
import cs1Img from '../assets/images/gallery/cs_related_1.jpg';             // Example placeholder
import cs2Img from '../assets/images/gallery/cs_related_2.jpg';             // Example placeholder
import work1Img from '../assets/images/gallery/work_copyleaks_1.jpg';           // Example placeholder
import work2Img from '../assets/images/gallery/work_copyleaks_2.jpg';           // Example placeholder

// STEP 2: UPDATE this array with your actual image data (src, alt, caption)
const initialGalleryData = [
  { 
    id: 'p1', 
    src: personal1Img, 
    alt: "Description of personal image 1", 
    caption: "with my friends <3", 
    category: 'personal', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'p2', 
    src: personal2Img, 
    alt: "Description of personal image 2", 
    caption: "As a fire man 🔥 .. ", 
    category: 'personal', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'p3', 
    src: personal3Img, 
    alt: "Description of personal image 3", 
    caption: "cool", 
    category: 'personal', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'p4', 
    src: personal4Img, 
    alt: "Description of personal image 4", 
    caption: "Nature", 
    category: 'personal', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'cs1', 
    src: cs1Img, 
    alt: "CS related image 1", 
    caption: "At Tel-Hai", 
    category: 'cs', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'cs2', 
    src: cs2Img, 
    alt: "CS related image 2", 
    caption: "Haifa University", 
    category: 'cs', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'w1', 
    src: work1Img, 
    alt: "Work related image 1 (CopyLeaks)", 
    caption: "At the CopyLeaks office", 
    category: 'work', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
  { 
    id: 'w2', 
    src: work2Img, 
    alt: "Work related image 2 (CopyLeaks)", 
    caption: "CopyLeaks <3", 
    category: 'work', 
    likes: 0, 
    comments: [], 
    showComments: false, 
    likedByUser: false 
  },
];

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
    onAddComment(itemData.id, { name: commenterName.trim(), text: commentText.trim() });
    setCommenterName(''); 
    setCommentText('');   
  };

  return (
    <div className="gallery-item-card">
      <div className="gallery-image-container">
        <img src={itemData.src} alt={itemData.alt} className="gallery-image" />
      </div>
      {itemData.caption && <p className="gallery-caption">{itemData.caption}</p>}
      
      <div className="gallery-item-interactions">
        <button 
          onClick={() => onLike(itemData.id)} 
          className={`like-button ${itemData.likedByUser ? 'liked' : ''}`}
          aria-pressed={itemData.likedByUser}
          title={itemData.likedByUser ? 'Unlike' : 'Like'}
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
              itemData.comments.map((comment, index) => (
                <div key={index} className="comment">
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

// --- GalleryPage Component (Manages the overall gallery state) ---
function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState(initialGalleryData);

  const handleLike = (itemId) => {
    setGalleryItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          return { 
            ...item, 
            likes: item.likedByUser ? item.likes - 1 : item.likes + 1, 
            likedByUser: !item.likedByUser 
          };
        }
        return item;
      })
    );
  };

  const handleAddComment = (itemId, newComment) => {
    setGalleryItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          // Add new comment to the beginning of the array to show newest first
          return { 
            ...item, 
            comments: [newComment, ...item.comments] 
          };
        }
        return item;
      })
    );
  };

  const handleToggleComments = (itemId) => {
    setGalleryItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          return { ...item, showComments: !item.showComments };
        }
        // Optionally, to close other comment sections when one is opened:
        // return { ...item, showComments: false };
        return item; // Keeps other items' comment visibility as is
      })
    );
  };

  return (
    <div className="gallery-page page-section">
      <div className="container">
        <h2 className="gallery-page-title">My Gallery</h2>
        <p className="gallery-intro">
          A collection of moments, interests, and things that inspire me.
          (Likes and comments are for demo purposes and will reset on page refresh.)
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