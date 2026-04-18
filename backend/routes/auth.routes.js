// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// In-memory store for admin registration attempts (for demo; use Redis/DB in production)
const adminAttempts = new Map();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET,
{ expiresIn: '7d' });
// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
const { name, email, password, role, adminPassword } = req.body;
const normalizedEmail = email?.trim().toLowerCase();
const clientIP = req.ip || req.connection.remoteAddress;

try {
const exists = await User.findOne({ email: normalizedEmail });
if (exists) return res.status(400).json({ message: 'Email is already registered' });

let userRole = 'member'; // default

if (role === 'admin') {
  const key = `${normalizedEmail}:${clientIP}`;
  const now = Date.now();
  const attemptData = adminAttempts.get(key) || { count: 0, lastAttempt: 0 };

  // Check cooldown (5 minutes)
  if (attemptData.count >= 3 && (now - attemptData.lastAttempt) < 5 * 60 * 1000) {
    const remainingTime = Math.ceil((5 * 60 * 1000 - (now - attemptData.lastAttempt)) / 1000);
    return res.status(429).json({ message: `Too many attempts. Try again in ${remainingTime} seconds.` });
  }

  if (adminPassword !== 'ESCANILLA20') {
    attemptData.count += 1;
    attemptData.lastAttempt = now;
    adminAttempts.set(key, attemptData);
    return res.status(400).json({ message: 'Incorrect admin password.' });
  }

  // Reset attempts on success
  adminAttempts.delete(key);
  userRole = 'admin';
} else if (role !== 'member') {
  return res.status(400).json({ message: 'Invalid role. Choose member or admin.' });
}

const hashedPassword = await bcrypt.hash(password, 12);
const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, role: userRole });
res.status(201).json({
token: generateToken(user._id),
user: { _id: user._id, name: user.name, email: user.email, role: user.role }
});
} catch (err) { res.status(500).json({ message: err.message }); }
});
// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
const { email, password } = req.body;
const normalizedEmail = email?.trim().toLowerCase();
try {
const user = await User.findOne({ email: normalizedEmail });
if (!user) return res.status(400).json({ message: 'Invalid email or password' });
if (user.status === 'inactive')
return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
const match = await user.matchPassword(password);
if (!match) return res.status(400).json({ message: 'Invalid email or password' });
res.json({
token: generateToken(user._id),
user: { _id: user._id, name: user.name, email: user.email, role:
user.role, profilePic: user.profilePic }
});
} catch (err) { res.status(500).json({ message: err.message }); }
});
// ── GET /api/auth/me ──────────────────────────────────────────
// Returns the currently logged-in user's data (requires token)
router.get('/me', protect, async (req, res) => {
const user = await User.findById(req.user._id).select('-password');

res.json(user);
});

// ── GET /api/auth/users/:id ─────────────────────────────────────
// Public: fetch another user's public profile by ID
router.get('/users/:id', async (req, res) => {
try {
const user = await User.findById(req.params.id).select('-password');
if (!user) return res.status(404).json({ message: 'User not found' });
res.json(user);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
// ── PUT /api/auth/profile ─────────────────────────────────────
// Update name, bio, or upload a new profile picture
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
try {
const user = await User.findById(req.user._id);
if (req.body.name) user.name = req.body.name;
if (req.body.bio) user.bio = req.body.bio;
if (req.file) user.profilePic = req.file.filename;
await user.save();
const updated = await User.findById(user._id).select('-password');
res.json(updated);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// ── PUT /api/auth/change-password ────────────────────────────
router.put('/change-password', protect, async (req, res) => {
const { currentPassword, newPassword } = req.body;
try {
const user = await User.findById(req.user._id);
const match = await user.matchPassword(currentPassword);
if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
user.password = newPassword; // pre-save hook will hash this
await user.save();
res.json({ message: 'Password updated successfully' });
} catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;