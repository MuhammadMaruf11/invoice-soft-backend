const Admin = require('../models/Admin.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const registerAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ adminname: req.body.adminname });
        if (admin) return res.status(400).send("Admin already exists");
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newAdmin = new Admin({
                adminname: req.body.adminname,
                email: req.body.email,
                password: hash,
            });
            try {
                const savedAdmin = await newAdmin.save();
                res.send({
                    success: true,
                    message: "Admin is created Successfully",
                    data: {
                        id: savedAdmin._id,
                        adminname: savedAdmin.adminname,
                        password: savedAdmin.hash,
                    },
                });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send({
                    success: false,
                    message: "Admin is not created",
                    error: error.message,
                });
            }
        });
    } catch (error) {
        console.error('error', error.message)
        res.status(500).send(error.message);
    }
}

const loginAdmin = async (req, res, next) => {
    try {
        const { adminname, password } = req.body;

        // Check if the admin exists
        const admin = await Admin.findOne({ adminname });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Credential",
            });
        }

        // Compare passwords
        const isPasswordValid = bcrypt.compareSync(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Credential",
            });
        }

        // Generate JWT token
        const payload = { id: admin._id, adminname: admin.adminname };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2d" });

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            token: `Bearer ${token}`,
            adminId: admin._id,
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const logoutAdmin = async (req, res, next) => {
    // Get the token from the request headers or body
    const token = req.headers.authorization || req.body.token;
    try {
        // Find the user based on the token
        const admin = await Admin.findOne({ token: token });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Clear the token from the user document
        admin.token = '';
        await admin.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        console.log('token ', token);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAdminProfile = async (req, res, next) => {

}

module.exports = {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
};

