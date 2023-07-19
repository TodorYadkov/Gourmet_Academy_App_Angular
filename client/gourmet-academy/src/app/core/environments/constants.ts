export const constants = {
    hostBackEnd: 'http://localhost:3000/',
    weatherURL: (weatherApiKey: string) => `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=auto:ip&lang=bg`,
    userTokenName: '65c227bd8f4eb7fe5ee3cd2ad13a5a8c',
    defaultPaginationPageNum: '1',
    defaultPaginationLimitNum: '3',
};

export const endpoints = {
    register: 'users/register', // post
    login: 'users/login', // post
    logout: 'users/logout', // get
    getUserById: (userId: string) => `users/${userId}`, // get 
    getAllRestaurants: (page: string, limit: string) => `restaurants?page=${page}&limit=${limit}`, // get // Usage: from front with quey ?page=1&limit=6 {page: "currentNum", limit: 6}
    getRestaurantsBySearch: (restaurantName: string, location: string) => `restaurants/search?name=${restaurantName}&location=${location}`, // get
    getRestaurantById: (restaurantId: string) => `restaurants/${restaurantId}`, // get
    addNewRestaurant: 'restaurants', // post
    updateRestaurant: (restaurantId: string) => `restaurants/${restaurantId}`, // put
    deleteRestaurant: (restaurantId: string) => `restaurants/${restaurantId}`, // delete
    getAllProductsRestaurant: (restaurantId: string) => `restaurants/products/${restaurantId}`, // get
    getProductById: (productId: string) => `restaurants/products/product/${productId}`, // get
    addNewProduct: (restaurantId: string) => `restaurants/products/${restaurantId}`, // post
    updateProduct: (productId: string) => `restaurants/products/edit/${productId}`, // put
    deleteProduct: (productId: string) => `restaurants/products/delete/${productId}`, // delete   
    getCommentById: (commentId: string) => `restaurants/comments/comment/${commentId}`, // get
    getAllCommentsRestaurant: (restaurantId: string) => `restaurants/comments/${restaurantId}`, // get
    addNewComment: (restaurantId: string) => `restaurants/comments/${restaurantId}`, // post
    updateComment: (commentId: string) => `restaurants/comments/edit/${commentId}`, // put
    deleteComment: (commentId: string) => `restaurants/comments/delete/${commentId}`, // delete
    getUserRestaurants: (userId: string) => `restaurants/my-restaurants/${userId}`, // get
    getOrderById: (orderId: string) => `restaurants/orders/order/${orderId}`, // get
    getRestaurantOrders: (restaurantId: string) => `restaurants/orders/${restaurantId}`, // get     
    getUserBought: (userId: string) => `restaurants/orders/user-orders/${userId}`, // get     
    buyFromRestaurant: (restaurantId: string) => `restaurants/orders/buys/${restaurantId}`, // post
    updateOrder: (orderId: string) => `restaurants/orders/edit/${orderId}`, // put
    deleteOrder: (orderId: string) => `restaurants/orders/delete/${orderId}`, // delete
    getApiKeys: 'security/keys', // get
};

// Translate the errors and if they are different from the current ones show them in English
export const translateErrorsFromServer: Map<string, string> = new Map([
    ['Email is already used!', 'Имейлът е вече зает моля използвайте друг'],
    ['Invalid username or password!', 'Невалиден потребител или парола'],
    ['Invalid email', 'Въведеният имейл е невалиден'],
    ['Forbidden - Time is more than five minutes', 'Поръчката не може да се редактира. Изминали са повече от 5 минути. За допълнителна информация моля позвънете в ресторанта']
]);