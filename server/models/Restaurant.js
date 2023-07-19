const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        maxlength: [50, 'The restaurant name must be a maximum of fifty characters long']
    },
    location: {
        type: String,
        required: [true, 'Restaurant location is required'],
        maxlength: [50, 'Location must be a maximum of fifty characters long']
    },
    address: {
        type: String,
        required: [true, 'Restaurant address is required'],
        maxlength: [100, 'Address must be a maximum of one hundred characters long']
    },
    phone: {
        type: String,
        required: [true, 'Restaurant phone is required'],
        match: [/^\+\d{1,3}\d{3}\d{3}\d{3}$/, 'Restaurant phone must be in the following format <+359111222333>'],
    },
    cuisine: {
        type: String,
        required: [true, 'The cuisine type is required'],
        maxlength: [40, 'The cuisine type must be a maximum of forty characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [200, 'Description must be a maximum of two hundred characters long']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/[^ ]+$/gi, 'Image URL must start with http:// or https://'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Restaurant owner is required']
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { Restaurant };