const jwt = require('jsonwebtoken');
const { buildResp } = require('../helpers/response.helper');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json(buildResp(401, "You must login first to access this page.", [], []));
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
    } catch (error) {
        return res.status(401).json(buildResp(401, "You must login first to access this page.", [], []));
    }

    return next();
}

module.exports = isAuthenticated;