import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializeTheme } from './utils/themeUtils';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostPage from './pages/PostPage';
import AdminPage from './pages/AdminPage';
import AllPostsPage from './pages/AllPostsPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<SplashPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/all-posts' element={<AllPostsPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route
        path='/create-post'
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/edit-post/:id'
        element={
          <ProtectedRoute>
            <EditPostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path='/profile/:id' element={<UserProfilePage />} />
      <Route
        path='/admin'
        element={
          <ProtectedRoute role='admin'>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path='/posts/:id' element={<PostPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
