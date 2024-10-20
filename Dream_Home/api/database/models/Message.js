const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    chat: {
        type: String,
        default: ""
    },
    file: {
        type: String,
        default: ""
    },
    audio: {
        type: String,
        default: ""
    },
    messageType: {  // Optional: distinguish between text, file, or audio
        type: String,
        enum: ['text', 'file', 'audio'],
        default: 'text'
    },
    status: {  // Optional: for message delivery and read status
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
}, { timestamps: true }); // corrected to use { timestamps: true } to add createdAt and updatedAt fields

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;