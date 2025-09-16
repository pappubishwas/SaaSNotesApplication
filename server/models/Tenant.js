const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
