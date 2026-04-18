import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function PostCard({ post, onPostUpdate = () => {} }) {
  const { user } = useAuth();
  const isOwner = user && post.author && user._id === post.author._id;
  const [showComments, setShowComments] = useState(false);
  const initialComments = Array.isArray(post.comments) ? post.comments : [];
  const commentsPopulated = initialComments.length > 0 && initialComments.every(
    (comment) => comment.author && typeof comment.author !== 'string' && comment.author.name
  );
  const [comments, setComments] = useState(commentsPopulated ? initialComments : []);
  const [commentsLoaded, setCommentsLoaded] = useState(commentsPopulated);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [dislikes, setDislikes] = useState(post.dislikes?.length || 0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [userLiked, setUserLiked] = useState(
    user ? post.likes?.some(id => id === user._id) : false
  );
  const [userDisliked, setUserDisliked] = useState(
    user ? post.dislikes?.some(id => id === user._id) : false
  );

  const getAuthorRoleType = (author) => {
    const normalized = author?.name?.trim().toLowerCase();
    if (normalized === 'mark escanilla' || normalized?.includes('mark escanilla')) return 'owner';
    if (author?.role === 'admin') return 'admin';
    return 'member';
  }; 

  const authorRoleClass = getAuthorRoleType(post.author);
  const authorRoleLabel = authorRoleClass === 'owner' ? 'Owner' : authorRoleClass === 'admin' ? 'Admin' : 'Member';

  const commentCount = commentsLoaded ? comments.length : post.comments?.length || 0;

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onPostUpdate(post._id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }
    try {
      const response = await API.post(`/posts/${post._id}/like`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserLiked(!userLiked);
      if (userDisliked) setUserDisliked(false);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike posts');
      return;
    }
    try {
      const response = await API.post(`/posts/${post._id}/dislike`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserDisliked(!userDisliked);
      if (userLiked) setUserLiked(false);
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

  const commentCountValue = commentsLoaded ? comments.length : post.comments?.length || 0;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await API.post(`/posts/${post._id}/comment`, {
        text: newComment,
      });
      setComments(response.data.comments || []);
      setCommentsLoaded(true);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const loadComments = async () => {
    if (commentsLoaded) return;
    try {
      const response = await API.get(`/comments/${post._id}`);
      setComments(response.data || []);
      setCommentsLoaded(true);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${post._id}/comment/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const imageUrl = post.image ? `http://localhost:5000/uploads/${post.image}` : null;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <Link
            to={isOwner ? '/profile' : `/profile/${post.author?._id}`}
            className="author-link"
          >
            {post.author?.profilePic && (
              <img
                src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                alt={post.author.name}
                className="author-avatar"
              />
            )}
            <div className="post-author-details">
              <h4>{post.author?.name || 'Unknown'}</h4>
              {post.author && (
              <span className={`role-badge-small ${authorRoleClass}`}>
                {authorRoleLabel}
              </span>
            )}
            </div>
          </Link>
        </div>
        {user && (isOwner || user.role === 'admin') && (
          <button className="post-delete-btn" onClick={handleDeletePost}>
            Delete
          </button>
        )}
      </div>

      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="post-image"
          onClick={() => setImageModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title='Click to view full image'
        />
      )}

      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${userLiked ? 'active' : ''}`}
          onClick={handleLike}
          title="Like this post"
        >
          👍 Like ({likes})
        </button>
        <button 
          className={`action-btn dislike-btn ${userDisliked ? 'active' : ''}`}
          onClick={handleDislike}
          title="Dislike this post"
        >
          👎 Dislike ({dislikes})
        </button>
        <button 
          className="action-btn comment-btn"
          onClick={async () => {
            setShowComments(!showComments);
            if (!commentsLoaded) await loadComments();
          }}
          title="View comments"
        >
          💬 Comments ({commentCount})
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    {comment.author?.name ? (
                      <Link
                        to={comment.author._id ? `/profile/${comment.author._id}` : '/profile'}
                        className="comment-author-link"
                      >
                        <strong>{comment.author.name}</strong>
                      </Link>
                    ) : (
                      <strong>{typeof comment.author === 'string' ? comment.author : 'Unknown'}</strong>
                    )}
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {user && (user._id === comment.author?._id || user.role === 'admin') && (
                    <button 
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button type="submit" className="comment-submit">Post</button>
            </form>
          )}
        </div>
      )}

      <div className="post-date-section post-date-bottom">
        <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>

      {imageModalOpen && (
        <div className='modal-overlay' onClick={() => setImageModalOpen(false)}>
          <div className='modal-content'>
            <img 
              src={imageUrl}
              alt={post.title}
            />
            <button className='modal-close' onClick={() => setImageModalOpen(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
