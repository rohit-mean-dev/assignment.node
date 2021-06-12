const jwt = require('jsonwebtoken');
const createError = require("http-errors");

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "2h",
            audience: userId.toString(),
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};

const signRefreshAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.REFRESH_ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "10h",
            audience: userId.toString(),
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });

};

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next(createError.Unauthorized());
    } else {
        const token = authHeader.slice(7);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized());
            } else {
                next();
            }
        });
    }
};

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_ACCESS_TOKEN_SECRET,
            (err, payload) => {
                if (err) {
                    return reject(createError.Forbidden());
                } else {
                    const userId = payload.aud;
                    resolve(userId);
                }
            }
        );
    });
};

module.exports = {
    signAccessToken,
    signRefreshAccessToken,
    verifyAccessToken,
    verifyRefreshToken
};