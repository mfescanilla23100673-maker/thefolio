import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import pfpImage from '../assets/pfp20.jpg';

function HomePage() {
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
        const response = await API.get('/posts?limit=5');
        setPosts(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Unable to load posts. Make sure backend and MongoDB are running.';
        setError(errorMessage);
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
    <div className="home-page">
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
                <li><Link to="/home" className="active">Home</Link></li>
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

      <section className="hero">
        <div className="hero-text">
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={handleThemeToggle}
          >
            {themeIcon}
          </button>
          <h2>Welcome to My Web Programming Portfolio</h2>
          <p>
            Explore my poems and posts created as part of my journey in life, dedicated to love and creativity.
          </p>
        </div>
        <div className="hero-image">
          <img src={pfpImage} alt="Mark Escanilla" />
        </div>
      </section>

      <section className="section latest-posts-section">
        <div className="latest-posts-panel">
          <h3>Latest Posts</h3>
          {user && (
            <Link to="/create-post" className="btn-create-post">Create a New Post</Link>
          )}
        </div>
        {loading && <p>Loading posts...</p>}
        {error && <p className="error-msg">{error}</p>}
        {!loading && posts.length === 0 && <p>No posts available yet.</p>}
        <div className="posts-container">
          {posts.slice(0, 5).map((post) => (
            <PostCard key={post._id} post={post} onPostUpdate={handlePostDelete} />
          ))}
        </div>
        {!loading && posts.length > 5 && (
          <div className="see-all-posts-container">
            <Link to="/all-posts" className="btn-see-all">See All Posts →</Link>
          </div>
        )}
      </section>

      <section className="section">
        <h3>Portfolio Highlights</h3>
        <ul>
          <li>HTML & CSS projects and poems</li>
          <li>Responsive design for readers and authors</li>
          <li>Secure MERN auth with comments and roles</li>
          <li>Admin controls for members and posts</li>
        </ul>
      </section>

      <section className="section">
        <h3>Join the Community</h3>
        <p>Register to post your own content and participate in the poetry collection.</p>
        <Link to="/register">Register here →</Link>
      </section>

      <footer className="footer">
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
