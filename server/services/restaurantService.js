const { Comment } = require("../models/Comment");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { Restaurant } = require("../models/Restaurant");

// Restaurants
const addNewRestaurant = (restaurantData, userId) => {
    const { name, location, address, phone, cuisine, description, image } = restaurantData;
    return Restaurant.create({ name, location, address, phone, cuisine, description, image, owner: userId });
};

const updateRestaurant = (restaurantData, restaurantId) => {
    const { name, location, address, phone, cuisine, description, image } = restaurantData;
    return Restaurant.findByIdAndUpdate(restaurantId, { name, location, address, phone, cuisine, description, image }, { runValidators: true, new: true });
};

const deleteRestaurant = async (restaurantId) => {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId, { returnDocument: true });
    await Product.deleteMany({ restaurantId: restaurantId });
    await Comment.deleteMany({ restaurantId: restaurantId });
    await Order.deleteMany({ restaurantId: restaurantId });
    return deletedRestaurant;
};

const getRestaurantsBySearch = (nameInput = '', locationInput = '') => Restaurant.find(
    {
        name: { $regex: new RegExp(nameInput, 'gi') },
        location: { $regex: new RegExp(locationInput, 'gi') }
    }
);

const getRestaurantById = (restaurantId) => Restaurant.findById(restaurantId).populate('owner', ['name', 'email', 'phone', 'address', 'role']);

const getAllRestaurants = (page, limit) => Restaurant.find().skip((page - 1) * limit).limit(limit);

const getAllCountRestaurants = () => Restaurant.countDocuments();

const getUserRestaurants = (userId) => Restaurant.find({ owner: userId });

// Products
const addNewProduct = async (productData, restaurantId) => {
    const { name, weight, price, group, image } = productData;
    return await Product.create({ name, weight, price, group, image, restaurantId: restaurantId });
};

const updateProduct = (productData, productId) => {
    const { name, weight, price, group, image } = productData;
    return Product.findByIdAndUpdate(productId, { name, weight, price, group, image }, { runValidators: true, new: true });
};

const deleteProduct = (productId) => Product.findByIdAndDelete(productId, { returnDocument: true });

const getProductById = (productId) => Product.findById(productId).populate('restaurantId');

const getAllProducts = (restaurantId) => Product.find({ restaurantId: restaurantId });

// Comments
const addNewComment = (commentData, restaurantId, userId) => {
    const { comment } = commentData;
    return Comment.create({ comment, restaurantId, userId });
};

const getCommentById = (commentId) => Comment.findById(commentId).populate('userId', ['name', 'email', 'phone', 'address', 'role']);

const getAllComments = (restaurantId) => Comment.find({ restaurantId: restaurantId }).populate('userId', ['name', 'email', 'phone', 'address', 'role']);

const updateComment = (commentData, commentId) => {
    const { comment } = commentData;
    return Comment.findByIdAndUpdate(commentId, { comment }, { runValidators: true, new: true });
};

const deleteComment = (commentId) => Comment.findByIdAndDelete(commentId, { returnDocument: true });

// Orders
const buyFromRestaurant = (restaurantId, userId, boughtProducts) => {
    const { orders, addressDelivery, date } = boughtProducts;
    return Order.create({ restaurantId, userId, orders, addressDelivery, date })
};

const getRestaurantOrders = (restaurantId) => Order.find({ restaurantId: restaurantId }).populate('orders');
// If need
// .populate('userId', ['name', 'email', 'phone', 'address', 'role'])
// .populate('restaurantId');

const getAllUserOrders = (userId) => Order.find({ userId: userId }).populate('orders restaurantId');

const getUserOrderById = (orderId) => Order.findById(orderId).populate('orders restaurantId');

const updateUserOrder = (orderData, orderId) => {
    const { addressDelivery, orders } = orderData;
    return Order.findByIdAndUpdate(orderId, { addressDelivery, orders }, { runValidators: true, new: true });
};

const deleteUserOrder = (orderId) => Order.findByIdAndDelete(orderId, { returnDocument: true });

module.exports = {
    addNewRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    getAllRestaurants,
    getAllCountRestaurants,
    getRestaurantOrders,
    buyFromRestaurant,
    addNewProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    addNewComment,
    updateComment,
    getAllComments,
    getCommentById,
    deleteComment,
    getRestaurantsBySearch,
    getUserRestaurants,
    getAllUserOrders,
    getUserOrderById,
    updateUserOrder,
    deleteUserOrder,
};