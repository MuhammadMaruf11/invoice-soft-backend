require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')

const authRoutes = require('./routes/authRoutes');

const User = require('./models/User');
const Invoice = require('./models/Invoice');

const app = express();
require('./config/database');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);


app.post('/free-trial', async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice' });
    }
});

app.post('/invoice', passport.authenticate("jwt", { session: false }), async (req, res) => {
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


app.get('/invoice/:userId', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { userId } = req.params;
    try {
        const invoices = await Invoice.find({ userId: userId });
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
});

// profile route
app.get("/backend", passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return res.status(200).send({
            success: true,
            user: {
                id: req.user._id,
                username: req.user.username,
            },
        });
    }
);








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