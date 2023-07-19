const express = require('express');
const corsAdd = require('../middleware/corsAdd');
const userSession = require('../middleware/userSession');

module.exports = (app) => {
    // Add CORS 
    app.use(corsAdd());
    // Add middleware to use json data
    app.use(express.json());
    // Add middleware to get query data
    app.use(express.urlencoded({ extended: false }));
    // Check user token
    app.use(userSession());

}