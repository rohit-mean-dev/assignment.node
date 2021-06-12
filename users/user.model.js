const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new schema({

    firstName: {
        require: true,
        type: String,
    },
    lastName: {
        require: true,
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Number,
        required: true
    },
    verifiedAt: {
        type: Date,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    otpGeneratedAt: {
        type: Date,
        required: false
    }

});

userSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error)
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;