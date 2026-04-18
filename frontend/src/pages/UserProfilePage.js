import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isTheFolioAdmin = user?.role === 'admin' && user?.name?.toLowerCase() === 'thefolio admin';
  const [themeIcon, setThemeIcon] = useState('🌙');
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    initializeTheme();
    setThemeIcon(getThemeIcon());
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          API.get(`/auth/users/${id}`),
          API.get(`/posts?author=${id}`),
        ]);
        setProfileUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className='error-msg'>{error}</p>;
  }

  if (!profileUser) {
    return <p className='error-msg'>Profile not found.</p>;
  }

  const isSelf = user && user._id === profileUser._id;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

  return (
    <div className='user-profile-page'>
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
                {!user && <li><Link to='/login'>Login</Link></li>}
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

        <section className='section profile-section'>
          <div className='profile-hero'>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2>{profileUser.name}</h2>
                <span className={`role-badge ${profileUser.name?.trim().toLowerCase() === 'mark escanilla' ? 'owner' : profileUser.role === 'admin' ? 'admin' : 'member'}`}>
                  {profileUser.name?.trim().toLowerCase() === 'mark escanilla' ? 'Owner' : profileUser.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>
              <p>{profileUser.bio || 'No bio available yet.'}</p>
            </div>
            {profileUser.profilePic && (
              <img 
                src={`http://localhost:5000/uploads/${profileUser.profilePic}`}
                alt={profileUser.name}
                className='profile-pic-preview'
                onClick={() => setImageModalOpen(true)}
                style={{ cursor: 'pointer' }}
                title='Click to view full image'
              />
            )}
          </div>

          <div className='profile-stats'>
            <div>
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div>
              <strong>{totalLikes}</strong>
              <span>Total Likes</span>
            </div>
          </div>

          {isSelf && (
            <div className='profile-actions'>
              <Link className='btn-create-post' to='/create-post'>
                Create New Post
              </Link>
            </div>
          )}
        </section>

        <section className='section profile-posts-section'>
          <h3>{isSelf ? 'Your Posts' : `${profileUser.name}'s Posts`}</h3>
          {posts.length === 0 ? (
            <p>{isSelf ? 'You have not created any posts yet.' : 'This user has not posted yet.'}</p>
          ) : (
            <div className='profile-posts-list'>
              {posts.map((post) => (
                <div key={post._id} className='profile-user-post'>
                  <Link to={`/posts/${post._id}`} className='profile-post-title'>
                    {post.title}
                  </Link>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  <div className='post-meta'>
                    <span>{post.likes?.length || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {imageModalOpen && (
        <div className='modal-overlay' onClick={() => setImageModalOpen(false)}>
          <div className='modal-content'>
            <img 
              src={`http://localhost:5000/uploads/${profileUser.profilePic}`}
              alt={profileUser.name}
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

export default UserProfilePage;
