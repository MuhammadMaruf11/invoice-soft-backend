const User = require('../models/User');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const getAllUsers = async (req, res, next) => {
    try {
        // Extract page and limit from query parameters, with defaults for initial values
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the skip value based on page and limit
        const skip = (page - 1) * limit;

        // Fetch the users with pagination and excluding the password field
        const users = await User.find().select("-password").skip(skip).limit(limit);

        // Get the total number of users for pagination calculation
        const totalUsers = await User.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalUsers / limit);

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        return res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                limit,
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Find the user by ID
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the email already exists (and it's not the current user's email)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: "Email is already registered" });
            }
        }

        // If a new password is provided, hash it
        let hashedPassword = user.password; // Keep old password if not updated
        if (password) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Update user data
        user.username = username || user.username;
        user.email = email || user.email;
        user.password = hashedPassword; // Update only if password was provided

        // Save the updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params; // Get user ID from URL params

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteAllUsers = async (req, res, next) => {

}

module.exports = {
    getAllUsers, createUser, updateUser, deleteSingleUser, deleteAllUsers
}