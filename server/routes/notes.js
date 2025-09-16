const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { authMiddleware } = require('../middleware/auth');
const Tenant = require('../models/Tenant');


router.get('/', authMiddleware, async (req, res) => {
  const tenantSlug = req.user.tenant;
  const notes = await Note.find({ tenant: tenantSlug }).sort({ createdAt: -1 });
  res.json(notes);
});

router.post('/', authMiddleware, async (req, res) => {
  const tenantSlug = req.user.tenant;
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) return res.status(400).json({ error: 'Tenant not found' });

  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenantSlug });
    if (count >= 3) return res.status(403).json({ error: 'Free plan limit reached. Upgrade to Pro.' });
  }

  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });

  const note = new Note({ title, content: content || '', tenant: tenantSlug, ownerId: req.user.id });
  await note.save();
  res.status(201).json(note);
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  if (note.tenant !== req.user.tenant) return res.status(403).json({ error: 'Forbidden' });
  res.json(note);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  if (note.tenant !== req.user.tenant) return res.status(403).json({ error: 'Forbidden' });

  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });

  note.title = title;
  note.content = content || '';
  await note.save();
  res.json(note);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  if (note.tenant !== req.user.tenant) return res.status(403).json({ error: 'Forbidden' });

  await note.deleteOne();
  res.status(204).end();
});

module.exports = router;
