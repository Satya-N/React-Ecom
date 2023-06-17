const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ message: 'Please Login to Access' });
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedData) return res.status(400).json({ message: 'Token Not Matched' });
        req.user = await User.findById(decodedData.id);
        next();
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ message: `Role: ${req.user.role} is not allowed to Access` })
        };
        next();
    }
}

module.exports = { isAuthenticatedUser, authorizeRole }