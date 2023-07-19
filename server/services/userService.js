const { User } = require('../models/User.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { tokenBlackList } = require('../util/tokenBlackList.js');

// Get environment variable
require('dotenv').config();
const roundsBcrypt = Number(process.env.ROUNDS_BCRYPT);
const jwtSecret = process.env.JWT_SECRET;

async function userRegister(userData) {
    const { name, email, phone, address, password, role, companyIdentificationNumber } = userData;
    // Check if the username or email is already taken
    const isExisting = await User.findOne({ email });
    if (isExisting) {
        throw new Error('Email is already used!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, roundsBcrypt);

    // Create and save new user
    const user = await User.create({
        name,
        email,
        phone,
        address,
        role,
        companyIdentificationNumber,
        password: hashedPassword
    });

    // Create token
    const userToken = await generateToken(user);

    // Return user info
    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            companyIdentificationNumber: user.companyIdentificationNumber
        }
    };
}

async function userLogin(userData) {
    const { email, password } = userData;
    // Check if the user exist
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid username or password!');
    }

    // Validate password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        throw new Error('Invalid username or password!');
    }

    // Create token
    const userToken = await generateToken(user);

    // Return user info
    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            companyIdentificationNumber: user.companyIdentificationNumber
        }
    };
}

async function generateToken(user) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign({
                _id: user._id,
                email: user.email,
                name: user.name,
                address: user.address,
                phone: user.phone,
                role: user.role,
            },
                jwtSecret,
                { expiresIn: '1d' }, // TODO: This can be optimized with a token that expires every two minutes (Refresh Token on front end)
                (err, signedToken) => {
                    if (err) {
                        reject(new Error('The token could not be signed!'));
                    } else {
                        resolve(signedToken);
                    }
                }
            );
        });

        return token;
    } catch (err) {
        throw new Error('An error occurred while generating the token!');
    }
}

async function userLogout(userToken) {
    tokenBlackList.add(userToken);
}

const getUserById = (userId) => User.findById(userId).select('-password'); // Select all without password (-password)

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getUserById,
};