const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'owner', 'admin'],
        default: 'buyer'
    },
    avatar: {
        type: String
    },
    phoneNumber: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    savedProperties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
});

module.exports = mongoose.model('User', userSchema);
