## RESTful API Documentation

This documentation provides an overview of the RESTful API built with Node.js and Express.js. The API interacts with a MongoDB database using Mongoose. It is recommended to set the path to the database using environment variables and dotenv.

## Usage

To run the API, follow these steps:

    Clone the repository from GitHub.

    Install the required dependencies using npm install.

    Set up the environment variables by creating a .env file in the root directory of the project. Add the following line to the file, replacing <DB_PATH> with the actual path to your MongoDB database:

    makefile .env

    PORT = <YOUR_PORT>
    CONNECTION_STRING = <DB_PATH>
    ROUNDS_BCRYPT = <10>
    JWT_SECRET = <YOUR_SECRET>

    Start the server using npm start.

    The API will be available at http://localhost:<YOUR_PORT>/.

## Endpoints 
Users

    Register: POST /users/register

    Register a new user. Requires a JSON payload with user details.

    Login: POST /users/login

    Log in a user. Requires a JSON payload with login credentials.

    Logout: GET /users/logout

    Log out the current user.

    Get User by ID: GET /users/{userId}

    Retrieve user information by ID.

    Get User Bought: GET /users/orders/{userId}

    Retrieve orders made by a specific user.

Restaurants

    Get All Restaurants: GET /restaurants

    Retrieve a list of all restaurants. Supports pagination by sending a JSON payload with page and limit parameters.

    Get Restaurants by Search: GET /restaurants/search?name={restaurantName}&location={location}

    Search for restaurants by name and location.

    Get Restaurant by ID: GET /restaurants/{restaurantId}

    Retrieve restaurant information by ID.

    Add New Restaurant: POST /restaurants

    Add a new restaurant. Requires a JSON payload with restaurant details.

    Update Restaurant: PUT /restaurants/{restaurantId}

    Update an existing restaurant by ID. Requires a JSON payload with updated restaurant details.

    Delete Restaurant: DELETE /restaurants/{restaurantId}

    Delete a restaurant by ID.

    Get Restaurant Orders: GET /restaurants/orders/{restaurantId}

    Retrieve orders for a specific restaurant.

Products

    Get All Products of a Restaurant: GET /restaurants/products/{restaurantId}

    Retrieve all products of a specific restaurant.

    Get Product by ID: GET /restaurants/products/product/{productId}

    Retrieve product information by ID.

    Add New Product: POST /restaurants/products/{restaurantId}

    Add a new product to a restaurant. Requires a JSON payload with product details.

    Update Product: PUT /restaurants/products/edit/{productId}

    Update an existing product by ID. Requires a JSON payload with updated product details.

    Delete Product: DELETE /restaurants/products/delete/{productId}

    Delete a product by ID.

Orders

    Buy from Restaurant: POST /restaurants/buys/{restaurantId}

    Place an order at a specific restaurant. Requires a JSON payload with order details.

Comments

    Get Comment by ID: GET /restaurants/comments/comment/{commentId}

    Retrieve a comment by ID.

    Get All Comments of a Restaurant: GET /restaurants/comments/{restaurantId}

    Retrieve all comments for a specific restaurant.

    Add New Comment: POST /restaurants/comments/{restaurantId}

    Add a new comment to a restaurant. Requires a JSON payload with comment details.

    Update Comment: PUT /restaurants/comments/edit/{commentId}

    Update an existing comment by ID. Requires a JSON payload with updated comment details.

    Delete Comment: DELETE /restaurants/comments/delete/{commentId}

    Delete a comment by ID.

Security

    Get API Keys: GET /security/keys

    Retrieve API keys for authentication.

## Headers

    To make an authorization request, you must add:

    X-Autorization


This documentation provides a simplified overview of the API's endpoints. For more detailed information on request payloads and responses, refer to the API's source code.