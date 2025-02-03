const mongoose = require("mongoose");

// Define the admin schema
const adminSchema = new mongoose.Schema({
    adminname: {
        type: String,
        require: true,
        minlength: 4,
        maxLength: 16,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 8,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Admin', adminSchema);
