const { body } = require("express-validator");
const { checkUniqueEmail } = require('./user.controller');
const messages = require("../shared/ConstMessages");

const registerValidator = [
    body("firstName")
        .notEmpty()
        .withMessage(messages.firstNameRequired)
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage(messages.firstNameLength),
    body("lastName")
        .notEmpty()
        .withMessage(messages.lastNameRequired)
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage(messages.lastNameLength),
    body("email")
        .notEmpty()
        .withMessage(messages.emailRequired)
        .bail()
        .isEmail()
        .withMessage(messages.emailValid)
        .bail()
        .custom(async (email) => {
            const user = await checkUniqueEmail(email);
            console.log(user)
            if (user) {
                throw new Error(messages.emailExist);
            }
        }),
    body("password")
        .notEmpty()
        .withMessage(messages.passwordRequired)
        .bail()
        .isLength({ min: 8, max: 15 })
        .withMessage(messages.passwordValid),
];

const loginValidator = [
    body("email").notEmpty().withMessage(messages.emailRequired).bail().isEmail().withMessage(messages.emailValid),
    body("password").notEmpty().withMessage(messages.passwordRequired).bail().isLength({ min: 8, max: 15 })
        .withMessage(messages.passwordValid)
];

const verifyEmailValidator = [
    body("email").notEmpty().withMessage(messages.emailRequired),
    body("otp").notEmpty().withMessage(messages.otpRequired)
]

module.exports = {
    registerValidator,
    verifyEmailValidator,
    loginValidator
}