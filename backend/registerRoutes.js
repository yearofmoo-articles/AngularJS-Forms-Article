var mongoose = require('mongoose');

var Registration = mongoose.model('Registration');

module.exports = {

  checkUsername : function(req, res) {
    var username = req.query.u;
    Registration.find({ username: username }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.json(ok ? 200 : 400, {
          ok : ok
        });
      }, 500);
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
