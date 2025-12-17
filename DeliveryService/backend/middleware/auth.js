const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/jwt');

function authenticate(req, res, next) {
    const header = req.headers['authorization'];
    
    if (!header)
        return res.status(401).json({ message: "Token required" });

    const token = header.split(' ')[1];

    jwt.verify(token, SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user.roles.includes(role))
            return res.status(403).json({ message: "Access denied" });

        next();
    };
}

module.exports = { authenticate, authorizeRole };
