const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = '7d';

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and Password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role, tenant: user.tenant }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({ token, user: { id: user._id, email: user.email, role: user.role, tenant: user.tenant }});
});



router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      tenant: req.user.tenant,
      tenantInfo: req.tenant ? {
        slug: req.tenant.slug,
        name: req.tenant.name,
        plan: req.tenant.plan
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch current user" });
  }
});


module.exports = router;
