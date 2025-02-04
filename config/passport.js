const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const Admin = require('../models/Admin');
require('dotenv').config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};

// User strategy
passport.use('user-rule', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.error('Error in user JWT strategy:', error);
        return done(error, false);
    }
}));

// Admin strategy
passport.use('admin-rule', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const admin = await Admin.findById(jwt_payload.id);
        if (admin) {
            return done(null, admin);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.error('Error in admin JWT strategy:', error);
        return done(error, false);
    }
}));
