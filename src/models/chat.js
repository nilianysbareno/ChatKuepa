const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
  nickname: String,
  userType: String,
  msg: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);