// frontend/src/pages/PostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';

const PostPage = () => {
 const { id } = useParams();
 const { user } = useAuth();
 const navigate = useNavigate();
 const [post, setPost] = useState(null);
 const [comments, setComments] = useState([]);
 const [commentBody, setCommentBody] = useState('');
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [themeIcon, setThemeIcon] = useState('🌙');
 const [expanded, setExpanded] = useState(false);
 const [imageModalOpen, setImageModalOpen] = useState(false);
 const isTheFolioAdmin = user?.role === 'admin' && user?.name?.toLowerCase() === 'thefolio admin';

 const getAuthorRoleType = (author) => {
   const normalized = author?.name?.trim().toLowerCase();
   if (normalized === 'mark escanilla' || normalized?.includes('mark escanilla')) return 'owner';
   if (author?.role === 'admin') return 'admin';
   return 'member';
 };

 useEffect(() => {
 initializeTheme();
 setThemeIcon(getThemeIcon());
 }, []);

 const handleThemeToggle = () => {
 toggleTheme();
 setThemeIcon(getThemeIcon());
 };

 useEffect(() => {
 const fetchData = async () => {
 try {
 const [postRes, commentsRes] = await Promise.all([
 API.get(`/posts/${id}`),
 API.get(`/comments/${id}`),
 ]);
 setPost(postRes.data);
 setComments(commentsRes.data);
 } catch (err) {
 setError('Post not found.');
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, [id])
 const handleAddComment = async (e) => {
 e.preventDefault();
 if (!commentBody.trim()) return;
 try {
 const { data } = await API.post(`/comments/${id}`, { body:
commentBody });
 setComments([...comments, data]);
 setCommentBody('');
 } catch (err) {
 alert(err.response?.data?.message || 'Failed to add comment');
 }
 };
 const handleDeleteComment = async (commentId) => {
 if (!window.confirm('Delete this comment?')) return;
 try {
 await API.delete(`/comments/${commentId}`);
 setComments(comments.filter(c => c._id !== commentId));
 } catch (err) {
 alert(err.response?.data?.message || 'Failed to delete comment');
 }
 };
 const handleDeletePost = async () => {
 if (!window.confirm('Are you sure you want to delete this post?')) return;
 try {
 await API.delete(`/posts/${id}`);
 navigate('/home');
 } catch (err) {
 alert(err.response?.data?.message || 'Failed to delete post');
 }
 };
 if (loading) return <p>Loading post...</p>;
 if (error) return <p className='error-msg'>{error}</p>;
 if (!post) return <p>Post not found.</p>;
 const isOwner = user && post.author && user._id === post.author._id;
 const isAdmin = user && user.role === 'admin';
 const bodyText = post.body || '';
 const isLongContent = bodyText.length > 500;
 const displayedBody = !expanded && isLongContent ? bodyText.substring(0, 500) + '...' : bodyText;

 return (
 <div className='post-page'>
 <header className='header'>
 <h1 className='logo'>MFAE POETRY</h1>
 <nav className='nav'>
 <ul>
   {isTheFolioAdmin ? (
     <>
       <li><Link to='/admin'>Admin Dashboard</Link></li>
     </>
   ) : (
     <>
       <li><Link to='/home'>Home</Link></li>
       <li><Link to='/about'>About</Link></li>
       <li><Link to='/contact'>Contact</Link></li>
       {user && <li><Link to='/profile'>Profile</Link></li>}
     </>
   )}
 </ul>
 </nav>
 </header>

 <main className='container'>
 <button id='theme-toggle' className='theme-toggle' onClick={handleThemeToggle}>
 {themeIcon}
 </button>

 <section className='section post-detail-section'>
 <div className='post-detail-header'>
 <button className='btn-back' onClick={() => navigate(-1)}>← Back</button>
 </div>

 <article className='post-detail-content'>
 {post.image && (
 <img 
   src={`http://localhost:5000/uploads/${post.image}`}
   alt={post.title} 
   className='post-detail-image'
   onClick={() => setImageModalOpen(true)}
   style={{ cursor: 'pointer' }}
   title='Click to view full image'
 />
 )}

 <h1>{post.title}</h1>

 <div className='post-detail-meta'>
 <Link 
   to={isOwner ? '/profile' : `/profile/${post.author?._id}`}
   className='post-author-link'
 >
   {post.author?.profilePic && (
     <img
       src={`http://localhost:5000/uploads/${post.author.profilePic}`}
       alt={post.author.name}
       className='post-detail-avatar'
       onClick={() => setImageModalOpen(false)}
     />
   )}
   <div className='post-author-info'>
     <h4>{post.author?.name}</h4>
     {post.author && (
       <span className={`role-badge ${getAuthorRoleType(post.author)}`}>
         {getAuthorRoleType(post.author) === 'owner' ? 'Owner' : post.author.role === 'admin' ? 'Admin' : 'Member'}
       </span>
     )}
   </div>
 </Link>
 <span className='post-detail-date'>{new Date(post.createdAt).toLocaleDateString()}</span>
 </div>

 {(isOwner || isAdmin) && (
 <div className='post-detail-actions'>
 <Link to={`/edit-post/${post._id}`} className='btn-submit'>Edit</Link>
 <button onClick={handleDeletePost} className='btn-danger'>Delete</button>
 </div>
 )}

 <div className='post-detail-body'>
 {displayedBody.split('\n').map((paragraph, i) => (
 <p key={i}>{paragraph}</p>
 ))}
 </div>

 {isLongContent && (
 <button className='btn-expand' onClick={() => setExpanded(!expanded)}>
 {expanded ? 'Hide' : 'See All'}
 </button>
 )}

 <div className='comments-section'>
 <h3>Comments ({comments.length})</h3>
 {comments.length === 0 ? (
 <p className='no-comments'>No comments yet. Be the first to comment!</p>
 ) : (
 <div className='comments-list'>
   {comments.map(comment => (
     <div key={comment._id} className='comment'>
       <div className='comment-header'>
         {comment.author?.name ? (
           <Link
             to={comment.author._id ? `/profile/${comment.author._id}` : '/profile'}
             className='comment-author-link'
           >
             <strong>{comment.author.name}</strong>
           </Link>
         ) : (
           <strong>{typeof comment.author === 'string' ? comment.author : 'Unknown'}</strong>
         )}
         <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
         {user && (comment.author?._id === user._id || isAdmin) && (
           <button onClick={() => handleDeleteComment(comment._id)}
           className='btn-sm-danger'>Delete</button>
         )}
       </div>
       <p>{comment.body}</p>
     </div>
   ))}
 </div>
 )}
 {user ? (
 <form onSubmit={handleAddComment} className='comment-form'>
 <textarea placeholder='Write a comment...'
 value={commentBody}
 onChange={e => setCommentBody(e.target.value)}
 rows={3} required />
 <button type='submit'>Post Comment</button>
 </form>
 ) : (
 <p><Link to='/login'>Login</Link> to leave a comment.</p>
 )}
 </div>
 </article>
 </section>
 </main>

 {imageModalOpen && (
 <div className='modal-overlay' onClick={() => setImageModalOpen(false)}>
 <div className='modal-content'>
 <img 
   src={`http://localhost:5000/uploads/${post.image}`}
   alt={post.title}
 />
 <button className='modal-close' onClick={() => setImageModalOpen(false)}>×</button>
 </div>
 </div>
 )}

 <footer className='footer'>
 <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
 <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
 </footer>
 </div>
 );
};
export default PostPage;
