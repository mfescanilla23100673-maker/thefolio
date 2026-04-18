import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import PostCard from '../components/PostCard';

function AllPostsPage() {
  const [themeIcon, setThemeIcon] = useState('🌙');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isTheFolioAdmin = user?.role === 'admin' && user?.name?.toLowerCase() === 'thefolio admin';

  useEffect(() => {
    initializeTheme();
    setThemeIcon(getThemeIcon());
    
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Unable to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  const handlePostDelete = (deletedId) => {
    setPosts((current) => current.filter(post => post._id !== deletedId));
  };

  return (
    <div className="all-posts-page">
      {/* HEADER / NAVIGATION */}
      <header className="header">
        <h1 className="logo">MFAE POETRY</h1>
        <nav className="nav">
          <ul>
            {isTheFolioAdmin ? (
              <>
                <li><Link to="/admin">Admin Dashboard</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/register">Registration</Link></li>
                {!user && <li><Link to="/login">Login</Link></li>}
                {user && <li><Link to="/profile">Profile</Link></li>}
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="container">
        <button
          id="theme-toggle"
          className="theme-toggle"
          onClick={handleThemeToggle}
        >
          {themeIcon}
        </button>

        <section className="section">
          <div className='section-headline'>
            <div>
              <h2>All Posts</h2>
              <p>Explore my complete collection of poems and reflections on love, life, and creativity.</p>
            </div>
            {user && (
              <Link to='/create-post' className='btn-create-post'>
                + Create New Post
              </Link>
            )}
          </div>

          {loading && <p>Loading posts...</p>}
          {error && <p className="error-msg">{error}</p>}
          {!loading && posts.length === 0 && <p>No posts available yet.</p>}

          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onPostUpdate={handlePostDelete} />
            ))}
          </div>

          {!loading && posts.length > 0 && (
            <div className="posts-footer">
              <p>Showing all {posts.length} post{posts.length !== 1 ? 's' : ''}</p>
              <Link to="/home" className="btn-back">← Back to Home</Link>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AllPostsPage;
