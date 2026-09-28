const express = require('express')
const router = express.Router()

const {
    login,
    verifyLoginOTP,
    logout,
    getMe,
    forgotPassword,
    verifyOTP,
    resetPassword
} = require('../controllers/authController')

const authUser = require('../middleware/authUser')

router.post('/login', login)

router.post('/verify-login-otp', verifyLoginOTP)

router.post('/logout', logout)

router.get('/me', authUser, getMe)

router.post('/forgot-password', forgotPassword)

router.post('/verify-otp', verifyOTP)

router.post('/reset-password', resetPassword)

module.exports = router