const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  const auth = req.user;
  if (auth.role !== 'admin') return res.status(403).json({ error: 'Only admins may invite' });

  const { email, role } = req.body || {};
  if (!email || !role) return res.status(400).json({ error: 'email and role required' });
  if (!['admin','member'].includes(role)) return res.status(400).json({ error: 'invalid role' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const pwHash = await bcrypt.hash('password', 10); 
  const u = new User({ email, passwordHash: pwHash, role, tenant: auth.tenant });
  await u.save();
  res.status(201).json({ id: u._id, email: u.email, role: u.role, tenant: u.tenant });
});

module.exports = router;
