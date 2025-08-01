import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hash , isAdmin});
    await user.save();
    const payload = { id: user._id, username: user.username, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'No user found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const payload = { id: user._id, username: user.username ,  isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});



export default router;
