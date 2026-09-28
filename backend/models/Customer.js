const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
    {
        // Personal Information
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        // Address
        address: {
            street: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            },

            country: {
                type: String,
                default: 'India'
            }
        },

        // Login
        password: {
            type: String,
            required: true,
            select: false
        },

        // Bank Account
        accountNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        accountType: {
            type: String,
            enum: ['Savings', 'Current'],
            default: 'Savings'
        },

        currency: {
            type: String,
            default: 'INR'
        },

        // KYC
        kyc: {
            status: {
                type: String,
                enum: ['Pending', 'Verified', 'Rejected'],
                default: 'Pending'
            },

            documentType: {
                type: String,
                enum: [
                    'Aadhaar',
                    'PAN',
                    'Passport',
                    'Driving License'
                ]
            },

            documentNumber: {
                type: String,
                trim: true
            },

            verifiedAt: {
                type: Date
            }
        },

        // Blockchain
        // walletAddress: {
        //     type: String,
        //     unique: true,
        //     sparse: true,
        //     trim: true
        // },

        // Account Status
        accountStatus: {
            type: String,
            enum: [
                'Active',
                'Inactive',
                'Frozen',
                'Blocked'
            ],
            default: 'Active'
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer