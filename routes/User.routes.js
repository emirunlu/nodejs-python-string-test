var user = require("../controllers/User.Controller");
const { check, validationResult } = require('express-validator');

var VerifyToken = require('./middleware.js');
module.exports = (app) => {
    app.post("/signup", [
        check('firstname').exists().trim().escape(),
        check('lastname').exists().trim().escape(),
        check('code').exists().trim().escape(),
        check('email').exists().trim().escape(),
        check('password').exists().isLength({ min: 8 }).trim().escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.signup(req, res)
    });

    app.post("/signin", user.signin);
    app.get("/signout", user.signout);

    app.get("/account/get",
    VerifyToken,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.get(req, res)
    });

    app.post("/account/updateNickname", [
        check('email').isEmail().normalizeEmail(),
        check('nickname').isLength({ min: 6 }).trim().escape(),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.updateNickname(req, res)
    });

    app.post("/account/updatePassword", [
        check('username').isEmail().normalizeEmail(),
        check('hash').isLength({ min: 5 }).trim().escape(),
        check('newPassword').isLength({ min: 5 }).trim().escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.updatePassword(req, res)
    });
};