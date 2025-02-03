const express = require('express');
const { getAllUsers, createUser, updateUser, deleteSingleUser, deleteAllUsers } = require('../controllers/allUsersController');
const passport = require('passport');
require('../config/adminPassport')

const router = express.Router();

router.get('/getUsers', passport.authenticate("jwt", { session: false }), getAllUsers)
router.post('/createUser', passport.authenticate("jwt", { session: false }), createUser)
router.patch('/updateUser/:id', passport.authenticate("jwt", { session: false }), updateUser)
router.delete('/deleteSingleUser/:id', passport.authenticate("jwt", { session: false }), deleteSingleUser)
router.delete('/deleteAllUsers', passport.authenticate("jwt", { session: false }), deleteAllUsers)

module.exports = router;