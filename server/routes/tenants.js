const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { authMiddleware } = require('../middleware/auth');


router.post('/:slug/upgrade', authMiddleware, async (req, res) => {
  const slug = req.params.slug;
  if (req.user.tenant !== slug) return res.status(403).json({ error: 'Cannot upgrade other tenant' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Only admin can upgrade' });

  const t = await Tenant.findOne({ slug });
  if (!t) return res.status(404).json({ error: 'Tenant not found' });

  t.plan = 'pro';
  await t.save();
  return res.json({ ok: true, tenant: { slug: t.slug, name: t.name, plan: t.plan }});
});


router.get('/:slug', authMiddleware, async (req, res) => {
  const slug = req.params.slug;
  const tenant = await Tenant.findOne({ slug });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  res.json({
    slug: tenant.slug,
    name: tenant.name,
    plan: tenant.plan
  });
});

module.exports = router;
