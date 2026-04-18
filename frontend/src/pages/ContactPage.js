import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';

function ContactPage() {
  const [themeIcon, setThemeIcon] = React.useState('🌙');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme();
    setThemeIcon(getThemeIcon());
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`Thanks, ${formData.name}! Message received.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* HEADER / NAVIGATION */}
      <header className="header">
        <h1 className="logo">MFAE POETRY</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact" className="active">Contact</Link></li>
            <li><Link to="/register">Registration</Link></li>
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
          <h2>Get in Touch</h2>
          <p>Email: mfescanilla23100673@student.dmmmsu.edu.ph</p>
          <p>Phone: 09120863514</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name" 
              required 
            />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email" 
              required 
            />
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message" 
              rows="5" 
              required
            ></textarea>
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </section>

        <section className="section">
          <h3>Poetry Resources & Tools</h3>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://www.poetryfoundation.org" target="_blank" rel="noreferrer">Poetry Foundation</a></td>
                <td>A massive library of classic and contemporary poems.</td>
              </tr>
              <tr>
                <td><a href="https://www.rhymezone.com" target="_blank" rel="noreferrer">RhymeZone</a></td>
                <td>A great tool for finding rhymes and synonyms for songwriting and poetry.</td>
              </tr>
              <tr>
                <td><a href="https://www.gutenberg.org" target="_blank" rel="noreferrer">Project Gutenberg</a></td>
                <td>Free access to thousands of classic literature eBooks and poetry collections.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="section">
          <h3>Find Me Here</h3>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.464525890538!2d120.3228!3d16.0381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a243d4d38c6d%3A0x6b1f237f3743c4a1!2sDMMMSU!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="DMMMSU Location"
            ></iframe>
          </div>
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

export default ContactPage;
