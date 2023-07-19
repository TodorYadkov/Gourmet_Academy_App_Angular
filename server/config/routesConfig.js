const restaurantController = require("../controllers/restaurantController");
const userController = require("../controllers/userController");
const securityController = require("../controllers/securityController");
const displayReq = require("../middleware/displayReq");

module.exports = (app) => {
    // Display each request
    app.use(displayReq());
    
    // Main routes
    app.use('/restaurants', restaurantController);
    app.use('/users', userController);

    // To get environments from the front end
    app.use('/security', securityController);

    // Use 404 no content
    app.all('*', (req, res, next) => {
        try {
            throw new Error(`No content - path ${req.path} of method ${req.method} not found`);
        } catch (error) {
            error.statusCode = 404;
            next(error);
        }
    });
};