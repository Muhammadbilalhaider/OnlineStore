const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_N = process.env.SECRET_KEY;

const authUser = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    token = token.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, SECRET_N);

        if (!decodedToken) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authUser;
