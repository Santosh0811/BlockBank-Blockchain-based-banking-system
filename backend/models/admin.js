const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ['admin'],
            default: 'admin',
        },

        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Suspended'],
            default: 'Active',
        },

        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

module.exports = Admin;