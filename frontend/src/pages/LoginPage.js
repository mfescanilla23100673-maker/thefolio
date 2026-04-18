import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';
import logo from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [themeIcon, setThemeIcon] = useState('🌙');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    initializeTheme();
    setThemeIcon(getThemeIcon());
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <h1 className="logo">MFAE POETRY</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="active">Login</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container">
        <button id="theme-toggle" className="theme-toggle" onClick={handleThemeToggle}>
          {themeIcon}
        </button>

        <section className="login-hero">
          <img src={logo} alt="MFAE Poetry Logo" className="login-image" />
          <div className="login-info">
            <h2>Welcome Back</h2>
            <p>Log in to your account to share your poetry, connect with the community, and manage your posts.</p>
          </div>
        </section>

        <section className="section">
          <h3>Login Form</h3>
          {serverError && <p className="error-msg">{serverError}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}

            <label>Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}

            <button type="submit" className="btn-submit">Login Now</button>
          </form>
          <p className="small-text">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;