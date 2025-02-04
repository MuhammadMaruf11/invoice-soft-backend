const express = require('express');
const { getAllUsers, createUser, updateUser, deleteSingleUser, deleteAllUsers } = require('../controllers/allUsersController');
const passport = require('passport');
require('../config/passport')

const router = express.Router();

router.get('/getUsers', passport.authenticate("admin-rule", { session: false }), getAllUsers)
router.post('/createUser', passport.authenticate("admin-rule", { session: false }), createUser)
router.patch('/updateUser/:id', passport.authenticate("admin-rule", { session: false }), updateUser)
router.delete('/deleteSingleUser/:id', passport.authenticate("admin-rule", { session: false }), deleteSingleUser)
router.delete('/deleteAllUsers', passport.authenticate("admin-rule", { session: false }), deleteAllUsers)

module.exports = router;