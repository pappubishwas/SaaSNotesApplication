require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

async function main() {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) {
    console.error('MONGO_URI not set in env. Copy .env.example -> .env and set your MONGO_URI');
    process.exit(1);
  }
  await mongoose.connect(MONGO);
  console.log('Connected to MongoDB');

  
  const tenantsData = [
    { slug: 'acme', name: 'Acme', plan: 'free' },
    { slug: 'globex', name: 'Globex', plan: 'free' }
  ];

  for (const t of tenantsData) {
    const existing = await Tenant.findOne({ slug: t.slug });
    if (!existing) {
      await Tenant.create(t);
      console.log('Created tenant', t.slug);
    } else {
      existing.name = t.name;
      existing.plan = t.plan;
      await existing.save();
      console.log('Updated tenant', t.slug);
    }
  }

  const users = [
    { email: 'admin@acme.test', role: 'admin', tenant: 'acme' },
    { email: 'user@acme.test', role: 'member', tenant: 'acme' },
    { email: 'admin@globex.test', role: 'admin', tenant: 'globex' },
    { email: 'user@globex.test', role: 'member', tenant: 'globex' }
  ];

  for (const u of users) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      const hash = await bcrypt.hash('password', 10);
      await User.create({ email: u.email, passwordHash: hash, role: u.role, tenant: u.tenant });
      console.log('Created user', u.email);
    } else {
      existing.role = u.role;
      existing.tenant = u.tenant;
      existing.passwordHash = await bcrypt.hash('password', 10);
      await existing.save();
      console.log('Updated user', u.email);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
