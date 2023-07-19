function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    }
}

function onlyForGuest(req, res, next) {
    if (req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    } else {
        next();
    }
}

function isOwner(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (res.locals.preload?.role == 'user') {
        // Check User model
        // Check if the current user can view their own orders
        if (req.user._id == res.locals.preload._id) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
        }

    } else if (req.user._id == res.locals.preload?.owner?._id) {
        // Check Restaurand model
        // Check if the current user is the owner of the current restaurant
        next();

    } else if (req.user._id == res.locals.preload?.restaurantId?.owner) {
        // Check Product model
        // Check if the current user is the owner of the current product
        next();

    } else if (req.user._id == res.locals.preload?.userId?._id) {
        // Check Comment and Order model
        // Check if the current user is the owner of the current comment or order
        next();

    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

function isNotOwner(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user._id != res.locals.preload?.owner._id) {
        // Check if the current user is not the owner of the current content
        next();

    } else {
        return res.status(403).json({ message: 'The owner cannot perform this action', statusCode: 403 });
    }
}

function isRoleAdmin(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user.role === 'admin') {
        // Check if the current user has role admin
        next();

    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

function isAllowedTimeToChangeOrders(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (res.locals.preload?.date) {
        // Check Order model
        // Check if the current order is create before five minutes
        const timestampCreated = res.locals.preload?.date; // Timestamp on created date
        const timestampNow = new Date().getTime(); // Timestamp now

        const timeDifferenceInMilliseconds = Math.abs(timestampCreated - timestampNow); // Calculate difference in milliseconds
        const allowedTimeIntervalInMilliseconds = 5 * 60 * 1000; // Convert 5 minutes to milliseconds

        if (timeDifferenceInMilliseconds <= allowedTimeIntervalInMilliseconds) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden - Time is more than five minutes', statusCode: 403 });
        }
    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

module.exports = {
    isAuth,
    onlyForGuest,
    isOwner,
    isNotOwner,
    isRoleAdmin,
    isAllowedTimeToChangeOrders,
};
