// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) return res.status(400).send("User already exists");
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            });
            await newUser
                .save()
                .then((user) => {
                    res.send({
                        success: true,
                        message: "User is created Successfully",
                        user: {
                            id: user._id,
                            username: user.username,
                            password: user.hash,
                            email: user.email,
                            role: user.role,
                        },
                    });
                })
                .catch((error) => {
                    res.send({
                        success: false,
                        message: "User is not created",
                        error: error,
                    });
                    console.log('error: ', error);
                });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(401).send({
            success: false,
            message: 'User is not found'
        })
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(402).send({
            success: false,
            message: 'incorrect password'
        })
    }

    const payload = {
        id: user._id,
        username: user.username,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2d",
    });

    return res.status(200).send({
        success: true,
        message: "User is logged in successfully",
        token: "Bearer " + token,
        userId: user._id,
    });
}



// logout 
const logoutUser = async (req, res) => {
    // Get the token from the request headers or body
    const token = req.headers.authorization || req.body.token;

    try {
        // Find the user based on the token
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Clear the token from the user document
        user.token = '';
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        console.log('token ', token);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
};

