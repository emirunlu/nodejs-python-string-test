const db = require('../config/sequelize');
const User = db.users;
const Response = require('./response');

exports.signup = async (req, res) => {

    if (req.body.code != '80085') {
        return res.status(200).json(Response.create(
            false,
            'Wrong code.',
            null,
            Response.ERRORS.INVALID_CODE
        ));
    }

    User.findOne({ where: { email: req.body.email } })
        .then((userExists) => {
            if (userExists) {
                return res.status(200).json(Response.create(
                    false,
                    'Email already used.',
                    null,
                    Response.ERRORS.EMAIL_ALREADY_USED
                ));
            }

            let pwd = User.setPassword(req.body.password);
            return User.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    hash: pwd.hash,
                    salt: pwd.salt
                })
                .then(() => {
                    return res.status(200).json(Response.create(
                        true,
                        'User created.',
                        null
                    ));
                });
        })
        .catch((err) => {
            return res.status(500).json(Response.create(
                false,
                'There were a database error. Please check data for further informations.',
                err,
                Response.ERRORS.DB_ERROR
            ));
        });
};

exports.signin = (req, res) => {
    if (!req.body.username || !req.body.hash) {
        return res.status(400).json(req.body.username);
    }

    passport.authenticate("local", (err, user, info) => {
        let token;
        if (err) {
            return res.status(500).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (1)',
                err,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        if (!user) {
            return res.status(200).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (2)',
                info,
                Response.ERRORS.AUTH_ERROR
            ));
        } else {
            token = User.generateJwt(user);

            return res.status(200).json(Response.create(
                true,
                'Connected.',
                { token: token }
            ));
        }
    })(req, res);
};

exports.signout = (req, res) => {
    req.logout();

    return res.status(200).json(Response.create(
        true,
        'Disconnected.',
        null
    ));
};

exports.get = (req, res) => {
    User.findByPk(req.userId)
        .then(user => {
            if (!user) {
                return res.status(200).json(Response.create(
                    false,
                    'Did not find any user for the provided id.',
                    null,
                    Response.ERRORS.USER_NOT_FOUND
                ));
            }

            var userData = {
                firstname: user.firstname,
                lastname: user.lastname,
                nickname: user.nickname,
                email: user.email,
                phoneNumber: user.phoneNumber
            }

            return res.status(200).json(Response.create(
                true,
                'User data found.',
                { user: userData }
            ));
        })
        .catch((err) => {
            return res.status(500).json(Response.create(
                false,
                'There were a database error. Please check data for further informations.',
                err,
                Response.ERRORS.DB_ERROR
            ));
        });
}

exports.updatePassword = (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (1)',
                err,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        if (!user) {
            return res.status(200).json(Response.create(
                false,
                'There were a auth error. Please check data for further informations. (2)',
                info,
                Response.ERRORS.AUTH_ERROR
            ));
        }

        let pwd = User.setPassword(req.body.newPassword);
        user.hash = pwd.hash;
        user.salt = pwd.salt;
        user.save()
            .then(() => {
                return res.status(200).json(Response.create(
                    true,
                    'Password was updated.',
                    null
                ));
            })
            .catch((err) => {
                return res.status(500).json(Response.create(
                    false,
                    'There were a database error. Please check data for further informations.',
                    err,
                    Response.ERRORS.DB_ERROR
                ));
            });
    })(req, res);
};

exports.updateNickname = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(200).json(Response.create(
                    false,
                    'Did not find any user for the provided id.',
                    null,
                    Response.ERRORS.USER_NOT_FOUND
                ));
            }

            return User.findOne({ nickname: req.body.nickname })
                .then(nicknameUser => {
                    if (nicknameUser) {
                        return res.status(200).json(Response.create(
                            false,
                            'Nickname already used.',
                            null,
                            Response.ERRORS.USER_NOT_FOUND
                        ));
                    }

                    user.nickname = req.body.nickname;
                    return user.save()
                        .then(() => {
                            return res.status(200).json(Response.create(
                                true,
                                'Nickname was updated.',
                                null
                            ));
                        })
                });
        })
        .catch((err) => {
            return res.status(500).json(Response.create(
                false,
                'There were a database error. Please check data for further informations.',
                err,
                Response.ERRORS.DB_ERROR
            ));
        });
};