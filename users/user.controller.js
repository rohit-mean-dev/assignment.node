const createError = require("http-errors");
const { validationResult } = require("express-validator");
const validationException = require("../error/ValidationError");
const successResponse = require("../helpers/success-response");
const userModel = require('./user.model');
const message = require("../shared/ConstMessages");
const messages = require("../shared/ConstMessages");
const { email } = require('../shared/email-sender');
const { fileReader } = require('../shared/file-reader')
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            next(new validationException(errors.array()));
        } else {
            req.body.createdAt = new Date();
            req.body.isVerified = 0;
            req.body.otp = ("" + Math.random()).substring(2, 8);
            req.body.otpGeneratedAt = req.body.createdAt;
            const user = new userModel(req.body);
            const result = await user.save();
            const salt = await bcrypt.genSalt(6);
            const hashedEmail = Buffer.from(req.body.email).toString('base64');
            const hashedOtp = Buffer.from(req.body.otp).toString('base64');
            const newValues = {
                '#user-name': `${req.body.firstName} ${req.body.lastName}`,
                '#email-verify-link': `${process.env.EMAIL_VERIFY_LINK}?email=${hashedEmail}&otp=${hashedOtp}`
            }
            const mailContent = await fileReader("shared/email-verify.txt", newValues);
            await email(req.body.email, 'Please verify your email address.', mailContent);
            res.status(201);
            successResponse(res, {}, message.registered);
        }
    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            next(createError.Unauthorized(messages.invalidCredential));
        } else {
            const user = await findByEmail(req.body.email);
            if (!user) {
                next(createError.Unauthorized(messages.invalidCredential));
            } else if (user.isVerified === 1) {
                const result = await compareHashedPassword(req.body.password, user.password);
                if (result) {
                    const finalResponse = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        id: user._id
                    };
                    successResponse(res, finalResponse, message.loggedIn);
                }
            } else {
                next(createError.Forbidden(message.verifyEmailToLogin));
            }
        }
    } catch (error) {
        next(error)
    }
};

const compareHashedPassword = async (password, hashedPassword) => {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        if (!result) {
            throw createError.Unauthorized(message.Unauthorized);
        }
        return result;
    } catch (error) {
        throw (error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            next(new validationException(errors.array()));
        } else {
            const otp = Buffer.from(req.body.otp, 'base64').toString()
            const email = Buffer.from(req.body.email, 'base64').toString()
            const user = await findByEmail(email);
            if (user) {
                if (user.isVerified === 1) {
                    successResponse(res, {}, message.alreadyEmailVerified);
                } else if (user.otpGeneratedAt.setHours(user.otpGeneratedAt.getHours() + 48) >= Date.now() && otp.toString() === user.otp.toString()) {
                    await userModel.findByIdAndUpdate(user._id, { isVerified: 1 });
                    successResponse(res, {}, message.emailVerified);
                } else {
                    next(createError.Unauthorized(message.otpExpired));
                }
            } else {
                next(createError.Forbidden());
            }
        }
    } catch (error) {
        next(error);
    }
}

const checkUniqueEmail = async (email) => {
    try {
        const user = await findByEmail(email);
        if (user) {
            if (user.isVerified === 0) {
                const result = await userModel.deleteOne({ email: email })
                return null;
            } else {
                return user;
            }
        } else {
            return null;
        }
    } catch (error) {
        next(error);
    }
};

const findByEmail = async (email) => {
    try {
        return await userModel.findOne({ email: email });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    checkUniqueEmail,
    verifyEmail,
    login
}