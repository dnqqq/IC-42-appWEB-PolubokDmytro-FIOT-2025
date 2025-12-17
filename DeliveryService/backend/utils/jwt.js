const jwt = require('jsonwebtoken');
const SECRET = 'supersecretkey123';

function generateToken(user) {
    return jwt.sign(
        {
            id: user.Id,
            roles: user.roles
        },
        SECRET,
        { expiresIn: '2h' }
    );
}

module.exports = { generateToken, SECRET };
