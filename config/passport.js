const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../config/sequelize');
const User = db.users;

module.exports = () => {
    passport.use(new LocalStrategy({
        passwordField: 'hash'
    }, (username, password, done) => {
        User.findOne({where: { email: username } })
        .then((user) => {
            if (!user) {
                return done(null, false, {
                    message: "Incorrect email."
                });
            }
            
            if (!User.ValidPassword(password, user.salt)) {
                return done(null, false, {
                    message: "Incorrect password."
                });
            }

            return done(null, user);
        })
        .catch((err) => {
            return done(err);
        });
    }));
};