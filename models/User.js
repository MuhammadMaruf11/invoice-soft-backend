const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minlength: 4,
    maxLength: 16,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);