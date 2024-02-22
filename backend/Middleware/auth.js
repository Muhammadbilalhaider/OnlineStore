const productModel = require('../Model/ProductModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_N = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    token = token.split(' ')[1];

    try {
        const user = jwt.verify(token, SECRET_N);

        if (!user.isAdmin) {
           
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
       
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = auth;
