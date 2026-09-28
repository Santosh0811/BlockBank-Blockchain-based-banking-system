const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 5001

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const connectDB = require('./db')
const createAdmin = require('./createAdmin')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cashierRoutes = require('./routes/cashierRoutes')
const customerRoutes = require('./routes/customerRoutes')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cashier', cashierRoutes)
app.use('/api/customer', customerRoutes)

// Start server only after database is ready
const startServer = async () => {
    try {
        await connectDB()
        await createAdmin()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

startServer()