const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [  // Store both owner and renter in an array
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    lastMessageAt: {  // Optional: for sorting conversations by recent activity
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
