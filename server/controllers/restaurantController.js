const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isAuth, isOwner, isNotOwner, isRoleAdmin, isAllowedTimeToChangeOrders } = require('../middleware/guards');
const { preload } = require('../middleware/preload');
const { getUserById } = require('../services/userService');
const {
    getAllCountRestaurants,
    getAllRestaurants,
    addNewRestaurant,
    updateRestaurant,
    getRestaurantById,
    deleteRestaurant,
    getRestaurantOrders,
    buyFromRestaurant,
    addNewProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    addNewComment,
    getCommentById,
    updateComment,
    deleteComment,
    getAllComments,
    getRestaurantsBySearch,
    getUserRestaurants,
    getAllUserOrders,
    getUserOrderById,
    updateUserOrder,
    deleteUserOrder,
}
    = require('../services/restaurantService');

// Get restaurants with pagination - Not Logged in
router.get('/', async (req, res, next) => {

    try {
        // Usage: from front edn send json with {page: "currentNum", limit: 6}
        const page = parseInt(req.query.page) || 1;   // Current page number, default is 1
        const limit = parseInt(req.query.limit) || 6; // Number of items per page, default is 6
        const [countRestaurants, restaurants] = await Promise.all([
            getAllCountRestaurants(),
            getAllRestaurants(page, limit),
        ]);

        const totalPages = Math.ceil(countRestaurants / limit); // Calculate total number of pages
        const result = { restaurants, page, totalPages };

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Get restaurant by search
router.get('/search', async (req, res, next) => {
    try {
        // Search - Search by location and by name
        const { name, location } = req.query;
        const restaurants = await getRestaurantsBySearch(name, location);

        res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
});

// Get one restaurant - Not Logged in
router.get('/:restaurantId', async (req, res, next) => {
    try {

        const restaurantId = req.params.restaurantId;
        const restaurant = await getRestaurantById(restaurantId); // With populated owner without password

        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
});


// Add new restaurant - Logged in
router.post('/',
    body(['name', 'location', 'address', 'phone', 'cuisine', 'description', 'image']).trim(),
    body('name').isLength({ max: 50 }).withMessage('The restaurant name must be a maximum of fifty characters long'),
    body('location').isLength({ max: 50 }).withMessage('Location must be a maximum of fifty characters long'),
    body('address').isLength({ max: 100 }).withMessage('Address must be a maximum of one hundred characters long'),
    body('phone').matches(/^\+\d{3}\d{3}\d{3}\d{3}$/).withMessage('Restaurant phone must be in the following format <+359111222333>'),
    body('cuisine').isLength({ max: 40 }).withMessage('Cuisine type must be a maximum of forty characters long'),
    body('description').isLength({ max: 200 }).withMessage('Description must be a maximum of two hundred characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const userId = req.user._id;
            const restaurantData = req.body;
            const newRestaurant = await addNewRestaurant(restaurantData, userId);

            res.status(201).json(newRestaurant);
        } catch (error) {
            next(error);
        }
    });


// Edit restaurant - Logged in and owner
router.put('/:restaurantId',
    body(['name', 'location', 'address', 'phone', 'cuisine', 'image']).trim(),
    body('name').isLength({ max: 50 }).withMessage('The restaurant name must be a maximum of fifty characters long'),
    body('location').isLength({ max: 50 }).withMessage('Location must be a maximum of fifty characters long'),
    body('address').isLength({ max: 100 }).withMessage('Address must be a maximum of one hundred characters long'),
    body('phone').matches(/^\+\d{3}\d{3}\d{3}\d{3}$/).withMessage('Restaurant phone must be in the following format <+359111222333>'),
    body('cuisine').isLength({ max: 40 }).withMessage('The cuisine type must be a maximum of forty characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    preload(getRestaurantById),
    isOwner,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            const restaurantId = req.params.restaurantId;
            const restaurantData = req.body;
            const updatedRestaurant = await updateRestaurant(restaurantData, restaurantId);

            res.status(200).json(updatedRestaurant);
        } catch (error) {
            next(error);
        }
    });

// Delete restaurant - Logged in and owner
router.delete('/:restaurantId', isAuth, preload(getRestaurantById), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const restaurantId = req.params.restaurantId;
        const deletedRestaurant = await deleteRestaurant(restaurantId);

        res.status(200).json({ message: 'Restaurant is successfully deleted', deletedRestaurant });
    } catch (error) {
        next(error);
    }
});

// Get all users restaurants - Logged in and owner
router.get('/my-restaurants/:userId', isAuth, isRoleAdmin, async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const userRestaurants = await getUserRestaurants(userId);

        res.status(200).json(userRestaurants);
    } catch (error) {
        next(error);
    }
});

// Get all products - everyone
router.get('/products/:restaurantId', async (req, res) => {
    try {

        const restaurantId = req.params.restaurantId;
        const allProducts = await getAllProducts(restaurantId);

        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
});

// Get one product - Logged in and owner
router.get('/products/product/:productId', isAuth, preload(getProductById, 'productId'), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const product = await getProductById(productId); // With populated restaurantId

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// Add new products to restaurant - Logged in and owner
router.post('/products/:restaurantId',
    body(['name', 'weight', 'price', 'group', 'image']).trim(),
    body('name').isLength({ max: 100 }).withMessage('Product must be a maximum of one hundred characters long'),
    body('weight').isLength({ max: 10 }).withMessage('Product must be a maximum of ten characters long'),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
    body('group').isLength({ max: 20 }).withMessage('Group must be a maximum of twenty characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    preload(getRestaurantById),
    isOwner,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const restaurantId = req.params.restaurantId;
            const productData = req.body;

            const newProduct = await addNewProduct(productData, restaurantId);

            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    });

// Edit product - Logged in and owner
router.put('/products/edit/:productId',
    body(['name', 'weight', 'price', 'group', 'image']).trim(),
    body('name').isLength({ max: 100 }).withMessage('Product must be a maximum of one hundred characters long'),
    body('weight').isLength({ max: 10 }).withMessage('Product must be a maximum of ten characters long'),
    body('price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
    body('group').isLength({ max: 20 }).withMessage('Group must be a maximum of twenty characters long'),
    body('image').matches(/^https?:\/\/[^ ]+$/gi).withMessage('Image URL must start with http:// or https://'),
    isAuth,
    preload(getProductById, 'productId'),
    isOwner,
    isRoleAdmin,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const productId = req.params.productId;
            const productData = req.body;
            const updatedProduct = await updateProduct(productData, productId);

            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    });

// Delete restaurant product - Logged in and owner
router.delete('/products/delete/:productId', isAuth, preload(getProductById, 'productId'), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const deletedProduct = await deleteProduct(productId);

        res.status(200).json({ message: 'Product is successfully deleted', deletedProduct });
    } catch (error) {
        next(error);
    }
});

// Get all restaurant orders to view all profit - Logged in and owner
router.get('/orders/:restaurantId', isAuth, preload(getRestaurantById), isOwner, isRoleAdmin, async (req, res, next) => {
    try {

        const restaurantId = req.params.restaurantId;
        const orders = await getRestaurantOrders(restaurantId);

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

// Buy products - Logged in
router.post('/orders/buys/:restaurantId', isAuth, async (req, res, next) => {
    try {

        const userId = req.user._id;
        const restaurantId = req.params.restaurantId;
        const boughtProducts = req.body;
        
        await buyFromRestaurant(restaurantId, userId, boughtProducts);

        res.status(200).json({ message: 'Successful purchase' });
    } catch (error) {
        next(error);
    }
});

//  Get all user orders - Logged in and owner
router.get('/orders/user-orders/:userId', isAuth, preload(getUserById, 'userId'), isOwner, async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const myOrders = await getAllUserOrders(userId);

        res.status(200).json(myOrders);
    } catch (error) {
        next(error);
    }
});

// Get one user order - Logged in and owner
router.get('/orders/order/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isOwner, async (req, res, next) => {
    try {

        const orderId = req.params.orderId;
        const myOrder = await getUserOrderById(orderId);

        res.status(200).json(myOrder);
    } catch (error) {
        next(error);
    }
});

// Edit order - Logged in and owner
router.put('/orders/edit/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isAllowedTimeToChangeOrders, isOwner, async (req, res, next) => {
    try {

        const orderData = req.body;
        const orderId = req.params.orderId;
        const updatedOrder = await updateUserOrder(orderData, orderId);

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
});

// Delete order - Logged in and owner
router.delete('/orders/delete/:orderId', isAuth, preload(getUserOrderById, 'orderId'), isAllowedTimeToChangeOrders, isOwner, async (req, res, next) => {
    try {

        const orderId = req.params.orderId;
        const deletedOrder = await deleteUserOrder(orderId);

        res.status(200).json({ message: 'Order is successfully deleted', deletedOrder });
    } catch (error) {
        next(error);
    }
});

// Get all comment - everyone
router.get('/comments/:restaurantId', async (req, res) => {
    try {

        const restaurantId = req.params.restaurantId;
        const allComments = await getAllComments(restaurantId);

        res.status(200).json(allComments);
    } catch (error) {
        next(error);
    }
});

// Get one comment - Logged in and owner
router.get('/comments/comment/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const comment = await getCommentById(commentId); // With populated userId

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
});

// Add comment - Logged in and not owner
router.post('/comments/:restaurantId',
    body('comment').trim(),
    body('comment')
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ max: 300 }).withMessage('Comment must be be a maximum of three hundred characters long'),
    isAuth,
    preload(getRestaurantById),
    isNotOwner,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const commentData = req.body;
            const restaurantId = req.params.restaurantId;
            const userId = req.user._id;
            const newComment = await addNewComment(commentData, restaurantId, userId);

            res.status(201).json(newComment);
        } catch (error) {
            next(error);
        }
    });

// Edit comment - Logged in and owner on this comment
router.put('/comments/edit/:commentId',
    body('comment').trim(),
    body('comment')
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ max: 300 }).withMessage('Comment must be be a maximum of three hundred characters long'),
    isAuth,
    preload(getCommentById, 'commentId'),
    isOwner,
    async (req, res, next) => {
        try {

            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const commentData = req.body;
            const commentId = req.params.commentId;
            const updatedComment = await updateComment(commentData, commentId);

            res.status(200).json(updatedComment);
        } catch (error) {
            next(error);
        }
    });

// Delete comment - Logged in and owner on this comment
router.delete('/comments/delete/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const deletedComment = await deleteComment(commentId);

        res.status(200).json({ message: 'Comment is successfully deleted', deletedComment });
    } catch (error) {
        next(error);
    }
});


module.exports = router;