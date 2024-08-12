const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerAddress: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
    },
    invoiceDetails: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    items: [
        {
            description: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    prepaid: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
    },
    delivery: {
        type: String,
    },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
