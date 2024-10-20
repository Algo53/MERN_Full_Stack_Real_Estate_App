const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    address: {
        latitude: Number,
        longitude: Number,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    type: {
        type: String,
        enum: ['appartement', 'house', 'commercial'],
        required: true
    },
    on: {
        type: String,
        enum: ['buy', 'rent'],
        default: 'rent'
    },
    size: Number, // size in square feet
    bedrooms: Number,
    bathrooms: Number,
    images: [String], // array of image URLs
    availableFrom: Date,
    listedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'rented'],
        default: 'available'
    },
    contactOwner: {
        type: Boolean,
        default: true
    },
    features: {
        pool : String,
        parking: String,
        gym : String,
        school : String
    }, // pool, gym, parking, etc.
    views: {
        type: Number,
        default: 0
    },
    savedByUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Property', propertySchema);
