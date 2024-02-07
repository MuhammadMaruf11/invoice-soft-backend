require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Invoice = require('./models/invoice');

const app = express();
require('./config/database');

app.use(cors({
    origin: '*'
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/invoice', async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
});

app.get('/getInvoice', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
});

// resource route

app.use((req, res, next) => {
    res.status(404).json({
        message: 'route not found'
    })
})


// server error

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('something broke!')
})




module.exports = app;