const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes middleware
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Set token from Bearer Token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Set token from cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token
    // }

    /* console.log(req.headers.authorization);
    console.log("token: ", token);
 */
    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        req.user = await User.findById(decoded.id); // Currently logged in user.

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific users
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403)); // forbidden error 
        }
        next();
    }
}