import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      const loaderContainer = document.querySelector('.loader-container');
      if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
      }
      
      setTimeout(() => {
        navigate('/home');
      }, 700);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page" style={styles.splashBody}>
      <div className="loader-container">
        <img src={logo} className="logo" alt="MFAE Poetry Logo" />
        <h1>MFAE POETRY</h1>
        <div className="line"></div>
        <div className="loader-spinner"></div>
        <div className="loading-text">Entering Creative Space...</div>
      </div>
    </div>
  );
}

export default SplashPage;

const styles = {
  splashBody: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #533483)',
    overflow: 'hidden',
    position: 'relative'
  }
};