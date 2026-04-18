// frontend/src/pages/CreatePostPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ImageCropper from '../components/ImageCropper';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';

const CreatePostPage = () => {
  const [themeIcon, setThemeIcon] = useState('🌙');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState('');
  const [isPostedFromProfile, setIsPostedFromProfile] = useState(false);

  const { user } = useAuth();
  const isTheFolioAdmin = user?.role === 'admin' && user?.name?.toLowerCase() === 'thefolio admin';
  const navigate = useNavigate();

  useEffect(() => {
    initializeTheme();
    setThemeIcon(getThemeIcon());
    // Check if user came from profile page
    const referrer = document.referrer;
    setIsPostedFromProfile(referrer.includes('/profile'));
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (imageFile && !croppedImage) {
      setError('Please crop the selected image before publishing.');
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (croppedImage) fd.append('image', croppedImage);

    try {
      await API.post('/posts', fd);
      navigate(isPostedFromProfile ? '/profile' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
    }
  };

  return (
    <div className='create-post-page'>
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
                <li><Link to='/profile'>Profile</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className='container'>
        <button id='theme-toggle' className='theme-toggle' onClick={handleThemeToggle}>
          {themeIcon}
        </button>

        <section className='section create-post-section'>
          <div className='post-hero'>
            <div>
              <h2>Create a New Post</h2>
              <p>Share your poetry with the community and publish your latest inspiration.</p>
            </div>
            <Link to='/home' className='btn-see-all'>Back to Home</Link>
          </div>

          {error && <p className='error-msg'>{error}</p>}

          <form onSubmit={handleSubmit} className='post-form'>
            <label>Post Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Post title'
              required
            />

            <label>Post Content</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder='Write your post here...'
              rows={12}
              required
            />

            <label>Upload Cover Image (Optional)</label>
            <input
              type='file'
              accept='image/*'
              onChange={e => {
                setImageFile(e.target.files[0]);
                setCroppedImage(null);
              }}
            />

            {imageFile && (
              <ImageCropper
                file={imageFile}
                onCrop={setCroppedImage}
                label='Crop post image'
              />
            )}

            <button type='submit' className='btn-submit'>Publish Post</button>
          </form>
        </section>
      </main>

      <footer className='footer'>
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CreatePostPage;