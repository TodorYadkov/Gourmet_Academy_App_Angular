const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { userRegister, userLogin, userLogout, getUserById } = require('../services/userService');
const { onlyForGuest, isAuth } = require('../middleware/guards');


// User register - Not logged in
router.post('/register',
    body(['name', 'email', 'phone', 'address', 'password', 'role', 'companyIdentificationNumber']).trim(),
    body('name')
        .notEmpty().withMessage('Name is required').bail()
        .isLength({ min: 2, max: 30 }).withMessage('Name must be between 2 and 30 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email'),
    body('phone')
        .notEmpty().withMessage('Phone is required').bail()
        .matches(/^\+\d{3}\d{3}\d{3}\d{3}$/).withMessage('Phone number must be in the following format <+359111222333>'),
    // .isMobilePhone().withMessage('Invalid phone number'),
    body('address')
        .notEmpty().withMessage('Address is required').bail()
        .isLength({ min: 5, max: 100 }).withMessage('Address must be between 5 and 100 characters long'),
    body('password')
        .notEmpty().withMessage('Password is required').bail()
        // .isStrongPassword({ minLength: 6, minNumbers: 2, minLowercase: 2, minUppercase: 2 })
        .isLength({ min: 6 }).withMessage('Password must be at least six characters long'),
    body('role')
        .custom((value) => ['user', 'admin'].includes(value)).withMessage('The role is not accepted'),
    onlyForGuest,
    async (req, res, next) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            const userData = req.body;
            const userInfo = await userRegister(userData);

            res.status(201).json(userInfo);
        } catch (error) {
            next(error);
        }
    });

// User login - Not logged in
router.post('/login',
    body(['email', 'password']).trim(),
    body('email')
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password is required').bail()
        // .isStrongPassword({ minLength: 6, minNumbers: 2, minLowercase: 2, minUppercase: 2 })
        .isLength({ min: 6 }).withMessage('Password must be at least six characters long'),
    onlyForGuest,
    async (req, res, next) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            const userData = req.body;
            const userInfo = await userLogin(userData);

            res.status(200).json(userInfo);
        } catch (error) {
            next(error);
        }
    });

// User logout - Logged in
router.get('/logout', isAuth, async (req, res, next) => {
    try {
        const userToken = req.userToken;
        await userLogout(userToken)

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
});

// Get user by id - Logged in
router.get('/:userId', isAuth, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await getUserById(userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;