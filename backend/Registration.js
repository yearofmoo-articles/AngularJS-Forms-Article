var mongoose = require('mongoose');

var registrationSchema = new mongoose.Schema({
  name : String,
  username: { type: String, unique: true },
  age : Number,
  password : String,
  details : String,
  dateFrom : Date,
  dateTo : Date,
  emails : [String]
});

mongoose.model('Registration', registrationSchema);

module.exports = registrationSchema;
