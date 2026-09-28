const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Customer = require('../models/Customer')
const Cashier = require('../models/Cashier')
const Admin = require('../models/admin')

const PasswordReset = require('../models/PasswordReset')
const LoginOTP = require('../models/LoginOTP')

const transporter = require('../config/mailer')

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }

        // Normalize email BEFORE using it anywhere
        const normalizedEmail = email
            .trim()
            .toLowerCase()

        // Find user
        let user = await Customer.findOne({
            email: normalizedEmail
        }).select('+password')

        let role = 'customer'

        if (!user) {
            user = await Cashier.findOne({
                email: normalizedEmail
            }).select('+password')

            role = 'cashier'
        }

        if (!user) {
            user = await Admin.findOne({
                email: normalizedEmail
            }).select('+password')

            role = 'admin'
        }

        // User not found
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        // Check account status
        if (role === 'customer') {
            if (user.accountStatus !== 'Active') {
                return res.status(403).json({
                    message: 'Your account is not active'
                })
            }
        } else {
            if (user.status !== 'Active') {
                return res.status(403).json({
                    message: 'Your account is not active'
                })
            }
        }

        // ==========================================
        // Generate Login OTP
        // ==========================================

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString()

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        )

        // Remove previous OTP
        await LoginOTP.deleteMany({
            email: normalizedEmail
        })

        const hashedOtp = await bcrypt.hash(otp, 10);

        // Save new OTP
        await LoginOTP.create({
            email: normalizedEmail,
            otp: hashedOtp,
            expiresAt
        })

        // ==========================================
        // Send OTP Email
        // ==========================================

        await transporter.sendMail({
            from: `"BlockBank" <${process.env.SMTP_USER}>`,
            to: normalizedEmail,
            subject: 'BlockBank Login Verification Code',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BlockBank Login Verification</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">

                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="background-color: #f5f7fa;"
                >
                    <tr>
                        <td align="center" style="padding: 32px 16px;">

                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    max-width: 560px;
                                    background-color: #ffffff;
                                    border: 1px solid #e5e7eb;
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td style="
                                        padding: 24px 32px;
                                        border-bottom: 1px solid #e5e7eb;
                                    ">

                                        <div style="
                                            font-size: 22px;
                                            line-height: 28px;
                                            font-weight: 700;
                                            color: #111827;
                                        ">
                                            BlockBank
                                        </div>

                                        <div style="
                                            margin-top: 3px;
                                            font-size: 12px;
                                            color: #6b7280;
                                        ">
                                            Secure Banking System
                                        </div>

                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 32px;">

                                        <p style="
                                            margin: 0 0 6px 0;
                                            font-size: 14px;
                                            color: #6b7280;
                                        ">
                                            Login verification
                                        </p>

                                        <h1 style="
                                            margin: 0 0 16px 0;
                                            font-size: 23px;
                                            line-height: 31px;
                                            font-weight: 600;
                                            color: #111827;
                                        ">
                                            Verify your login
                                        </h1>

                                        <p style="
                                            margin: 0;
                                            font-size: 14px;
                                            line-height: 23px;
                                            color: #4b5563;
                                        ">
                                            We received a request to sign in to your
                                            BlockBank account. Enter the verification
                                            code below to continue.
                                        </p>

                                        <!-- OTP -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="margin-top: 26px;"
                                        >
                                            <tr>
                                                <td align="center">

                                                    <div style="
                                                        display: inline-block;
                                                        padding: 15px 24px;
                                                        background-color: #f8fafc;
                                                        border: 1px solid #dbe3ee;
                                                        border-radius: 6px;
                                                    ">

                                                        <span style="
                                                            font-size: 28px;
                                                            line-height: 34px;
                                                            font-weight: 700;
                                                            letter-spacing: 6px;
                                                            color: #1d4ed8;
                                                        ">
                                                            ${otp}
                                                        </span>

                                                    </div>

                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin: 18px 0 0 0;
                                            text-align: center;
                                            font-size: 13px;
                                            color: #6b7280;
                                        ">
                                            This code expires in 10 minutes.
                                        </p>

                                        <!-- Security Notice -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="margin-top: 26px;"
                                        >
                                            <tr>
                                                <td style="
                                                    padding: 14px 16px;
                                                    background-color: #f8fafc;
                                                    border-left: 3px solid #2563eb;
                                                ">

                                                    <p style="
                                                        margin: 0;
                                                        font-size: 13px;
                                                        line-height: 20px;
                                                        color: #475569;
                                                    ">
                                                        For your security, never share
                                                        this verification code with
                                                        anyone. BlockBank will never ask
                                                        you to provide your OTP by email
                                                        or phone.
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin: 24px 0 0 0;
                                            font-size: 13px;
                                            line-height: 20px;
                                            color: #6b7280;
                                        ">
                                            If you did not attempt to sign in, you can
                                            safely ignore this email. Your account will
                                            not be accessed without the verification code.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="
                                        padding: 20px 32px;
                                        background-color: #f9fafb;
                                        border-top: 1px solid #e5e7eb;
                                        text-align: center;
                                    ">

                                        <p style="
                                            margin: 0;
                                            font-size: 11px;
                                            line-height: 18px;
                                            color: #9ca3af;
                                        ">
                                            This is an automated security message from
                                            BlockBank. Please do not reply to this email.
                                        </p>

                                        <p style="
                                            margin: 5px 0 0 0;
                                            font-size: 11px;
                                            color: #9ca3af;
                                        ">
                                            © ${new Date().getFullYear()} BlockBank
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            `
        })

        // IMPORTANT:
        // Do NOT create JWT here.
        // Do NOT set the token cookie here.

        return res.status(200).json({
            message: 'OTP sent to your registered email address',
            email: normalizedEmail
        })

    } catch (error) {
        console.error('Login error:', error)

        return res.status(500).json({
            message: 'Login failed. Please try again.'
        })
    }
}

const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            })
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase()

        const loginOTP = await LoginOTP.findOne({
            email: normalizedEmail
        })

        if (!loginOTP) {
            return res.status(400).json({
                message: 'OTP has expired or does not exist'
            })
        }

        if (loginOTP.expiresAt.getTime() < Date.now()) {
            await LoginOTP.deleteOne({
                _id: loginOTP._id
            })

            return res.status(400).json({
                message: 'OTP has expired'
            })
        }

        const isOtpValid = await bcrypt.compare(
            otp.toString(),
            loginOTP.otp
        )

        if (!isOtpValid) {
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }

        // Find the user again
        let user = await Customer.findOne({
            email: normalizedEmail
        })

        let role = 'customer'

        if (!user) {
            user = await Cashier.findOne({
                email: normalizedEmail
            })

            role = 'cashier'
        }

        if (!user) {
            user = await Admin.findOne({
                email: normalizedEmail
            })

            role = 'admin'
        }

        if (!user) {
            return res.status(404).json({
                message: 'User account not found'
            })
        }

        // Check account status
        if (user.status && user.status !== 'Active') {
            return res.status(403).json({
                message: 'Your account is not active'
            })
        }

        if (
            user.accountStatus &&
            user.accountStatus !== 'Active'
        ) {
            return res.status(403).json({
                message: 'Your account is not active'
            })
        }

        // Create JWT ONLY after OTP verification
        const token = jwt.sign(
            {
                userId: user._id,
                role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        res.cookie('blockbank_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:
                process.env.NODE_ENV === 'production'
                    ? 'none'
                    : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        if (role === 'customer') {
            user.isEmailVerified = true
        }

        user.lastLogin = new Date()
        await user.save()

        // Delete OTP after successful login
        await LoginOTP.deleteOne({
            _id: loginOTP._id
        })

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role
            }
        })

    } catch (error) {
        console.error(
            'Verify login OTP error:',
            error
        )

        res.status(500).json({
            message: 'Failed to verify login OTP'
        })
    }
}

const logout = (req, res) => {
    res.clearCookie('blockbank_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })

    res.status(200).json({
        message: 'Logged out successfully'
    })
}

const getMe = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                id: req.userId,
                role: req.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: 'Email address is required'
            })
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase()

        // Find account
        let user = await Customer.findOne({
            email: normalizedEmail
        })

        let role = 'customer'

        if (!user) {
            user = await Cashier.findOne({
                email: normalizedEmail
            })

            role = 'cashier'
        }

        if (!user) {
            user = await Admin.findOne({
                email: normalizedEmail
            })

            role = 'admin'
        }

        if (!user) {
            return res.status(404).json({
                message: 'No account found with this email address'
            })
        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString()

        // OTP expires in 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        )

        // Remove previous OTPs
        await PasswordReset.deleteMany({
            email: normalizedEmail
        })

        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store OTP
        await PasswordReset.create({
            email: normalizedEmail,
            otp: hashedOtp,
            expiresAt,
            verified: false
        })

        // Send email
        await transporter.sendMail({
            from: `"BlockBank" <${process.env.SMTP_USER}>`,
            to: normalizedEmail,
            subject: 'BlockBank Password Reset OTP',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BlockBank Password Reset</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">

                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="background-color: #f5f7fa;"
                >
                    <tr>
                        <td align="center" style="padding: 32px 16px;">

                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    max-width: 560px;
                                    background-color: #ffffff;
                                    border: 1px solid #e5e7eb;
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td style="
                                        padding: 24px 32px;
                                        border-bottom: 1px solid #e5e7eb;
                                    ">

                                        <div style="
                                            font-size: 22px;
                                            line-height: 28px;
                                            font-weight: 700;
                                            color: #111827;
                                        ">
                                            BlockBank
                                        </div>

                                        <div style="
                                            margin-top: 3px;
                                            font-size: 12px;
                                            color: #6b7280;
                                        ">
                                            Secure Banking System
                                        </div>

                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 32px;">

                                        <p style="
                                            margin: 0 0 6px 0;
                                            font-size: 14px;
                                            color: #6b7280;
                                        ">
                                            Account security
                                        </p>

                                        <h1 style="
                                            margin: 0 0 16px 0;
                                            font-size: 23px;
                                            line-height: 31px;
                                            font-weight: 600;
                                            color: #111827;
                                        ">
                                            Password reset request
                                        </h1>

                                        <p style="
                                            margin: 0;
                                            font-size: 14px;
                                            line-height: 23px;
                                            color: #4b5563;
                                        ">
                                            We received a request to reset the password
                                            for your BlockBank account. Use the
                                            verification code below to continue.
                                        </p>

                                        <!-- OTP -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="margin-top: 26px;"
                                        >
                                            <tr>
                                                <td align="center">

                                                    <div style="
                                                        display: inline-block;
                                                        padding: 15px 24px;
                                                        background-color: #f8fafc;
                                                        border: 1px solid #dbe3ee;
                                                        border-radius: 6px;
                                                    ">

                                                        <span style="
                                                            font-size: 28px;
                                                            line-height: 34px;
                                                            font-weight: 700;
                                                            letter-spacing: 6px;
                                                            color: #1d4ed8;
                                                        ">
                                                            ${otp}
                                                        </span>

                                                    </div>

                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin: 18px 0 0 0;
                                            text-align: center;
                                            font-size: 13px;
                                            color: #6b7280;
                                        ">
                                            This verification code expires in
                                            <strong style="color: #374151;">
                                                10 minutes
                                            </strong>.
                                        </p>

                                        <!-- Security Notice -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="margin-top: 26px;"
                                        >
                                            <tr>
                                                <td style="
                                                    padding: 14px 16px;
                                                    background-color: #f8fafc;
                                                    border-left: 3px solid #2563eb;
                                                ">

                                                    <p style="
                                                        margin: 0;
                                                        font-size: 13px;
                                                        line-height: 20px;
                                                        color: #475569;
                                                    ">
                                                        Never share this verification code
                                                        with anyone. BlockBank will never
                                                        ask you to provide your OTP by
                                                        email or phone.
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin: 24px 0 0 0;
                                            font-size: 13px;
                                            line-height: 20px;
                                            color: #6b7280;
                                        ">
                                            If you did not request a password reset,
                                            you can safely ignore this email. Your
                                            password will not be changed without
                                            completing the verification process.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="
                                        padding: 20px 32px;
                                        background-color: #f9fafb;
                                        border-top: 1px solid #e5e7eb;
                                        text-align: center;
                                    ">

                                        <p style="
                                            margin: 0;
                                            font-size: 11px;
                                            line-height: 18px;
                                            color: #9ca3af;
                                        ">
                                            This is an automated security message from
                                            BlockBank. Please do not reply to this email.
                                        </p>

                                        <p style="
                                            margin: 5px 0 0 0;
                                            font-size: 11px;
                                            color: #9ca3af;
                                        ">
                                            © ${new Date().getFullYear()} BlockBank
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            `
        })

        res.status(200).json({
            message: 'OTP has been sent to your registered email address',
            role
        })

    } catch (error) {
        console.error(
            'Forgot password error:',
            error
        )

        res.status(500).json({
            message: 'Failed to send password reset OTP'
        })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            })
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase()

        const resetRequest = await PasswordReset.findOne({
            email: normalizedEmail
        })

        if (!resetRequest) {
            return res.status(400).json({
                message: 'OTP has expired or does not exist'
            })
        }

        // Check expiration
        if (
            resetRequest.expiresAt.getTime() <
            Date.now()
        ) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id
            })

            return res.status(400).json({
                message: 'OTP has expired'
            })
        }

        // Check OTP
        const isOtpValid = await bcrypt.compare(
            otp.toString(),
            resetRequest.otp
        )

        if (!isOtpValid) {
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }

        // Mark OTP verified
        resetRequest.verified = true

        await resetRequest.save()

        res.status(200).json({
            message: 'OTP verified successfully'
        })

    } catch (error) {
        console.error(
            'Verify OTP error:',
            error
        )

        res.status(500).json({
            message: 'Failed to verify OTP'
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword
        } = req.body

        if (!email || !newPassword) {
            return res.status(400).json({
                message: 'Email and new password are required'
            })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            })
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase()

        // Find verified reset request
        const resetRequest = await PasswordReset.findOne({
            email: normalizedEmail,
            verified: true
        })

        if (!resetRequest) {
            return res.status(400).json({
                message: 'Please verify the OTP first'
            })
        }

        // Check OTP expiration
        if (
            resetRequest.expiresAt.getTime() <
            Date.now()
        ) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id
            })

            return res.status(400).json({
                message: 'Password reset session has expired'
            })
        }

        // Find user
        let user = await Customer.findOne({
            email: normalizedEmail
        })

        if (!user) {
            user = await Cashier.findOne({
                email: normalizedEmail
            })
        }

        if (!user) {
            user = await Admin.findOne({
                email: normalizedEmail
            })
        }

        if (!user) {
            return res.status(404).json({
                message: 'User account not found'
            })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        )

        // Save hashed password
        user.password = hashedPassword

        await user.save()

        // Delete used reset request
        await PasswordReset.deleteOne({
            _id: resetRequest._id
        })

        res.status(200).json({
            message: 'Password reset successfully'
        })

    } catch (error) {
        console.error(
            'Reset password error:',
            error
        )

        res.status(500).json({
            message: 'Failed to reset password'
        })
    }
}

module.exports = {
    login,
    verifyLoginOTP,
    logout,
    getMe,
    forgotPassword,
    verifyOTP,
    resetPassword
}