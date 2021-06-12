const express = require('express')
const router = express.Router();

const { registerValidator, verifyEmailValidator, loginValidator } = require('./user.validator')
const { register, verifyEmail, login } = require('./user.controller');
const { verifyAccessToken } = require('../helpers/jwt-helper');

router.post('/register', registerValidator, register);
router.post('/verify-email', verifyEmailValidator, verifyEmail);
router.post('/login', loginValidator, login);

module.exports = router;