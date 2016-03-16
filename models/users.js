var mongoose = require('mongoose');

//mongoose.connection.readyState;
var userSchema = new mongoose.Schema({
  
  username: {
    type: String
  },
  password: {
    type: String,
    default: '...'
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model('users', userSchema);
