const express = require('express');
const { freeTrial, createInvoice, invoice, getInvoice, getSingleInvoice, getUserInvoice, deleteSingleInvoice, deleteAllInvoices } = require('../controllers/invoiceController');
const { getUserProfile } = require('../controllers/userAuthController');
const passport = require('passport');
require('../config/passport')

const router = express.Router();

router.post('/freeTrial', freeTrial)
router.get('/singleInvoice/:userId', getSingleInvoice)
router.post('/createInvoice', passport.authenticate("user-rule", { session: false }), createInvoice)
router.post('/invoice', passport.authenticate("user-rule", { session: false }), invoice)
router.get('/profile', passport.authenticate("user-rule", { session: false }), getUserProfile);
router.get('/userInvoice/:userId', getUserInvoice)
router.get('/getInvoice', passport.authenticate("admin-rule", { session: false }), getInvoice)
router.get('/deleteInvoice/:invoiceId', passport.authenticate("admin-rule", { session: false }), deleteSingleInvoice)
router.get('/deleteInvoices', passport.authenticate("admin-rule", { session: false }), deleteAllInvoices)


module.exports = router;