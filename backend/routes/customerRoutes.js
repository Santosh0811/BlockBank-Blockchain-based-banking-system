const express = require('express')
const router = express.Router()

const authUser = require('../middleware/authUser')
const allowRoles = require('../middleware/allowRoles')

const {
    transferMoney,
    getMyProfile,
    getMyTransactions,
    verifyReceiver,
    changePassword
} = require('../controllers/customerController')

router.get(
    '/verify-receiver',
    authUser,
    allowRoles('customer'),
    verifyReceiver
)

router.get(
    '/profile',
    authUser,
    allowRoles('customer'),
    getMyProfile
)

router.get(
    '/transactions',
    authUser,
    allowRoles('customer'),
    getMyTransactions
)

router.post(
    '/transfer',
    authUser,
    allowRoles('customer'),
    transferMoney
)

router.put(
    '/change-password',
    authUser,
    allowRoles('customer'),
    changePassword
)

module.exports = router