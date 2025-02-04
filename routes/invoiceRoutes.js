const express = require('express');
const { freeTrial, createInvoice, invoice, getInvoice, getSingleInvoice } = require('../controllers/invoiceController');
const { getUserProfile } = require('../controllers/userAuthController');
const passport = require('passport');
require('../config/passport')

const router = express.Router();

router.post('/freeTrial', freeTrial)
router.post('/createInvoice', passport.authenticate("user-rule", { session: false }), createInvoice)
router.post('/invoice', passport.authenticate("user-rule", { session: false }), invoice)
router.get('/getInvoice', passport.authenticate("user-rule", { session: false }), getInvoice)
router.get('/invoice/:userId', passport.authenticate("user-rule", { session: false }), getSingleInvoice)
router.get('/profile', passport.authenticate("user-rule", { session: false }), getUserProfile);


module.exports = router;