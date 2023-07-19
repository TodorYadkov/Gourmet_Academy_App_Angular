const router = require('express').Router();
require('dotenv').config();

// Get all the api keys that are needed in the front end
router.get('/keys', async (req, res, next) => {
    try {
        const apiKeys = { // - ADD here if another key is needed
           weatherApiKey: process.env.API_KEY_WEATHER,
        };        

        res.status(200).json(apiKeys);
    } catch (error) {
        next(error);
    }
});

module.exports = router;