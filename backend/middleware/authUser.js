const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    try {
        const token = req.cookies.blockbank_token;

        if (!token) {
            return res.status(401).json({
                message: 'Login required'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;
        req.role = decoded.role;

        next();

    } catch (error) {
        console.error('Auth error:', error.message);

        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authUser;