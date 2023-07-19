const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        maxlength: [100, 'Product must be a maximum of one hundred characters long']
    },
    weight: {
        type: String,
        required: [true, 'Weight is required'],
        maxlength: [10, 'Product must be a maximum of ten characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        validate: {
            validator: (value) => value >= 0,
            message: 'Price must be a positive number'
        }
    },
    group: {
        type: String,
        required: [true, 'Group is required'],
        maxlength: [20, 'Group must be a maximum of twenty characters long']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/[^ ]+$/gi, 'Image URL must start with http:// or https://'],
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };