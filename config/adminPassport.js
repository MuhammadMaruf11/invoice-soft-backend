require("dotenv").config();
const Admin = require("../models/Admin");

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

const passport = require("passport");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const admin = await Admin.findById(jwt_payload.id);
            if (admin) {
                return done(null, admin);
            } else {
                return done(null, false);
            }
        } catch (error) {
            console.error('Error in JWT strategy:', error);
            return done(error, false);
        }
    })
);
