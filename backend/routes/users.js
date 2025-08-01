import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

// Delete user by ID (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  // Optionally: check cannot delete self
  if (req.user.id === req.params.id) {
    return res.status(400).json({ msg: "Admin cannot delete themselves." });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
});

// Add new user (admin only)
router.post('/', auth, admin, async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User exists.' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash, isAdmin: !!isAdmin });
  await user.save();
  res.json({ username: user.username, email: user.email, isAdmin: user.isAdmin });
});

export default router;
