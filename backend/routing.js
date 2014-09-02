var registerRoutes = require('./registerRoutes');
module.exports = function(app) {
  app.post('/register', registerRoutes.validateRecaptcha, registerRoutes.create);
  app.get('/username-exists', registerRoutes.checkUsername);
};
