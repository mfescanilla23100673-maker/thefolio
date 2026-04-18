// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ImageCropper from '../components/ImageCropper';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const isTheFolioAdmin = user?.role === 'admin' && user?.name?.toLowerCase() === 'thefolio admin';
  const isOwnerAccount = user?.name?.trim().toLowerCase() === 'mark escanilla';
  const [themeIcon, setThemeIcon] = useState('🌙');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedPic, setSelectedPic] = useState(null);
  const [croppedPic, setCroppedPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    initializeTheme();
    setThemeIcon(getThemeIcon());
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return;
      setLoadingPosts(true);
      try {
        const response = await API.get(`/posts?author=${user._id}`);
        setMyPosts(response.data);
        setTotalLikes(response.data.reduce((sum, post) => sum + (post.likes?.length || 0), 0));
      } catch (err) {
        console.error('Error loading user posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    if (selectedPic && !croppedPic) {
      setMsg('Please crop the selected image before saving.');
      return;
    }
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (croppedPic) fd.append('profilePic', croppedPic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
      setSelectedPic(null);
      setCroppedPic(null);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error changing password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : '/default-avatar.png';

  return (
    <div className='profile-page'>
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
                <li><Link to='/profile' className='active'>Profile</Link></li>
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
                <h2>My Profile</h2>
                {user && (
                  <span className={`role-badge ${isOwnerAccount ? 'owner' : user.role === 'admin' ? 'admin' : 'member'}`}>
                    {isOwnerAccount ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                )}
              </div>
              <p>{bio && bio.trim() ? bio : 'Keep your display name, bio, and profile picture up to date.'}</p>
            </div>
            <img src={picSrc} alt='Profile preview' className='profile-pic-preview' />
          </div>

          <div className='profile-actions'>
            <div className='profile-stats'>
              <div>
                <strong>{myPosts.length}</strong>
                <span>Posts</span>
              </div>
              <div>
                <strong>{totalLikes}</strong>
                <span>Total Likes</span>
              </div>
            </div>
            <button type='button' className='btn-logout' onClick={handleLogout}>
              Logout
            </button>
          </div>

          {msg && <p className='success-msg'>{msg}</p>}

          <div className='profile-grid'>
            <form onSubmit={handleProfile} className='profile-form'>
              <h3>Edit Profile</h3>
              <label>Display Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Display name'
              />

              <label>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder='Short bio...'
                rows={4}
              />

              <label>Profile Picture</label>
              <input
                type='file'
                accept='image/*'
                onChange={e => {
                  setSelectedPic(e.target.files[0]);
                  setCroppedPic(null);
                }}
              />

              {selectedPic && (
                <ImageCropper
                  file={selectedPic}
                  onCrop={setCroppedPic}
                  label='Crop profile photo'
                />
              )}

              <button type='submit' className='btn-submit'>Save Profile</button>
            </form>

            <form onSubmit={handlePassword} className='profile-form'>
              <h3>Change Password</h3>
              <label>Current Password</label>
              <input
                type='password'
                placeholder='Current password'
                value={curPw}
                onChange={e => setCurPw(e.target.value)}
                required
              />

              <label>New Password</label>
              <input
                type='password'
                placeholder='New password (min 6 chars)'
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
                minLength={6}
              />

              <button type='submit' className='btn-submit'>Change Password</button>
            </form>
          </div>
        </section>

        <section className='section profile-posts-section'>
          <div className='profile-posts-panel'>
            <div>
              <h3>My Posts</h3>
              <p>These are the posts you have created. Others can visit your profile to see them too.</p>
            </div>
            <Link to='/create-post' className='btn-create-post'>Create New Post</Link>
          </div>

          {loadingPosts ? (
            <p>Loading your posts...</p>
          ) : myPosts.length === 0 ? (
            <p>You haven’t created any posts yet.</p>
          ) : (
            <div className='profile-posts-list'>
              {myPosts.map((post) => (
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

      <footer className='footer'>
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;