var mongoose = require('mongoose');
var simple_recaptcha = require('simple-recaptcha');

var Registration = mongoose.model('Registration');

module.exports = {

  checkUsername : function(req, res) {
    var username = req.query.u;
    Registration.find({ username: username }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.status(ok ? 200 : 400).json({
          ok : ok
        });
      }, 500);
    });
  },

  validateRecaptcha: function(req, res, next) {
    if (/localhost:/.test(req.get('host'))) {
      next();
      return;
    }

    var ip = req.ip;
    var privateKey = '6LcnjvkSAAAAADxHhagUgsu_ZQm7TCFkb2mzLArD';
    var challenge = req.body.recaptcha.challenge;
    var response = req.body.recaptcha.response;

    simple_recaptcha(privateKey, ip, challenge, response, function(err) {
      if (err) {
        res.status(400).send({
          status: 'incorrect captcha'
        });
      } else {
        next();
      }
    });
  },

  create : function(req, res) {
    var data = req.body;
    var signup = new Registration(data);
    signup.save(function() {
      res.json(signup);
    });
  }

};
