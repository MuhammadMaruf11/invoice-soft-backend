const Invoice = require("../models/Invoice");

const freeTrial = async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
}

const invoice = async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
}

const createInvoice = async (req, res) => {
    try {
        const invoiceData = {
            ...req.body,
            userId: req.user._id,
        };

        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}

const getInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
}

const getSingleInvoice = async (req, res) => {
    const { userId } = req.params;

    try {
        const invoices = await Invoice.find({ userId: userId });
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
}

module.exports = {
    freeTrial, createInvoice, invoice, getInvoice, getSingleInvoice
}