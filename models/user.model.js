var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        firstname: { type: Sequelize.STRING, allowNull: false },
        lastname: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        hash: { type: Sequelize.STRING, allowNull: false },
        salt: { type: Sequelize.STRING, allowNull: false },

        createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    User.setPassword = function (password) {
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        return {
            salt: salt,
            hash: hash
        }
    };
    
    User.ValidPassword = function (password, salt) {
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return this.hash === hash;
    };
    
    User.generateJwt = function (user) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);
        return jwt.sign({
            id: user.id,
            username: user.firstName + user.lastName,
            //type: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 15)
        }, // 1 Hour
            "secretKey");
    };

    return User;
}