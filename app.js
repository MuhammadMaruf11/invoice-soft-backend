require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userAuthRoutes = require('./routes/userAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const allUsersRoutes = require('./routes/allUsersRoutes');

const app = express();
require('./config/database');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initial route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Invoice Software API' });
});

// Routes
app.use('/api/auth', userAuthRoutes);
app.use('/api/adminAuth', adminAuthRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/allUsers', allUsersRoutes);

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