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
app.use(passport.initialize());


// Routes
app.use('/api/auth', authRoutes);


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



// logout 
app.post('/logout', async (req, res) => {
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
        res.status(500).json({ message: 'Internal server error' });
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