const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model('Message', MessageSchema);
