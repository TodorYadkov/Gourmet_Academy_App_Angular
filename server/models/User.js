const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least two characters long'],
        maxlength: [30, 'Name must be a maximum of thirty characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        match: [/^\+\d{1,3}\d{3}\d{3}\d{3}$/, 'Phone must be in the following format <+359111222333>'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [5, 'Address must be at least five characters long'],
        maxlength: [100, 'Address must be a maximum of one hundred characters long']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not supported'
        },
        default: 'user',
    },
    companyIdentificationNumber: {
        type: String,
        default: null,
        match: [/^(BG|bg)\d{9}$/, 'Incorrect format of company identification number (Bulstat)'],
    }
});

userSchema.pre('save', function (next) {
    if (this.companyIdentificationNumber) {
        this.companyIdentificationNumber = this.companyIdentificationNumber.toUpperCase();
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = { User };