const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema(
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
        },

        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

// Automatically remove expired OTP documents
passwordResetSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)

const PasswordReset = mongoose.model(
    'PasswordReset',
    passwordResetSchema
)

module.exports = PasswordReset