var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//connect to mongoose
function bootDB(callback) {
  mongoose.connect('mongodb://localhost/yom-forms', function(err) {     

    require('./Registration');
    callback();
  });
}

function bootExpress(callback) {
  var app = express();
  app.use(bodyParser());

  require('./routing')(app);

  callback(app);
}

module.exports = function(fn) {
  bootDB(function() {
    bootExpress(fn);
  });
}

