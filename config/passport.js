require("dotenv").config();
const User = require("../models/User");
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {

        var user = await User.findOne({ _id: jwt_payload.id });

        return done(null, user);

    })
);
