const mongoose = require('mongoose')

const loginOTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
)

loginOTPSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)

const LoginOTP = mongoose.model('LoginOTP', loginOTPSchema)

module.exports = LoginOTP