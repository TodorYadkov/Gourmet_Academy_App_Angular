const mongoose = require('mongoose');

// Global error handler
module.exports = (err, req, res, next) => {
    // Get status code
    const statusCode = err.statusCode || 400;

    if (err instanceof mongoose.Error.ValidationError) {
        // Mongoose validation error
        return res.status(statusCode).json({ message: Object.values(err.errors).map(error => error.message), statusCode });
    } else if (err instanceof mongoose.Error) {
        // Other Mongoose errors
        if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ message: ['Duplicate key error'], statusCode: 400 });
        } else {
            // Other Mongoose errors
            return res.status(500).json({ message: ['Internal server error', err], statusCode: 500 });
        }
    } else if (Array.isArray(err)) {
        // Express Validator error
        return res.status(statusCode).json({ message: err.map(error => error.msg), statusCode });
    } else if (err instanceof Error) {
        // Custom server error
        return res.status(statusCode).json({ message: [err.message], statusCode });
    } else if (err instanceof TypeError) {
        // Custom server error
        return res.status(statusCode).json({ message: [err.message], statusCode });
    }


    // General Express errors
    return res.status(500).json({ message: ['Internal server error', err], statusCode: 500 });
};