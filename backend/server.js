const dotenv = require("dotenv");
dotenv.config(); // Load .env variables FIRST

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Connect to MongoDB
connectDB();

// ── CORS CONFIG (FIXED - SINGLE SOURCE OF TRUTH) ───────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://thefolio.vercel.app',
  'https://thefolio-4uhe.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ── Middleware ────────────────────────────────────────────────

// Parse JSON bodies
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// ── Start Server ──────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});