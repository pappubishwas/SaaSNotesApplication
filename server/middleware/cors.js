module.exports = function(app) {
  const cors = require('cors');
  app.use(cors({ origin: true, credentials: true }));
  app.options('*', cors());
};
