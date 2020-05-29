const mongoose = require('mongoose');
const { Schema } = mongoose;

new ChatSchema = new Schema({
    nick:String,
    msg = String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', ChatSchema);