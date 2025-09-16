require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const applyCors = require('./middleware/cors');

const authRoutes = require('./routes/auth');
const inviteRoute = require('./routes/invite');
const tenantsRoute = require('./routes/tenants');
const notesRoute = require('./routes/notes');

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

async function start() {
  if (!MONGO) {
    console.error('MONGO_URI missing in env. See .env.example');
    process.exit(1);
  }
  await mongoose.connect(MONGO);
  console.log('Connected to MongoDB');

  const app = express();
  applyCors(app);
  app.use(morgan('dev'));
  app.use(bodyParser.json());


  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/auth', authRoutes);           
  app.use('/invite', inviteRoute);        
  app.use('/tenants', tenantsRoute);      
  app.use('/notes', notesRoute);          

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
