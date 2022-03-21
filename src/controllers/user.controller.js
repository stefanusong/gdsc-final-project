const { buildResp } = require('../helpers/response.helper');
const User = require('./../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    User.findOne({ userEmail })
        .then(user => {
            // Check if user already exists
            if (user) return res.status(401).json(buildResp(401, "User already exists. Please try another email.", [], []));

            if (userPassword.length < 8) return res.status(401).json(buildResp(401, "Password must be at least 8 characters.", [], []));
            if (userPassword.length > 20) return res.status(401).json(buildResp(401, "Password must be at most 20 characters.", [], []));

            // Encrypt password
            const encryptedPassword = bcrypt.hashSync(userPassword, 10);

            // Otherwise, create the user
            const newUser = new User({ userName, userEmail, userPassword: encryptedPassword });
            newUser.save()
                .then(() => res.json(buildResp(200, "User registered successfully", { userName, userEmail }, [])))
                .catch(err => res.status(400).json({ error: 'Error registering new user: ' + err.message }));
        }
        );
};

const login = (req, res) => {
    const { userEmail, userPassword } = req.body;

    User.findOne({ userEmail })
        .then(user => {
            // Check if user exists
            if (!user) return res.status(400).json(buildResp(400, "Email is not found, Please try another email.", [], []));

            // Check if password is correct
            if (!bcrypt.compareSync(userPassword, user.userPassword)) return res.status(401).json(buildResp(401, "Password is incorrect, please try again.", [], []));

            // Generate token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Otherwise, send token to client (login success)
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 2, httpOnly: true });
            res.json(buildResp(200, "User logged in successfully", { userName: user.userName, userEmail: user.userEmail, accessToken: token }, []));
        }
        );
}

const logout = (req, res) => {
    res.cookie('token', '', { maxAge: -1 });
    res.clearCookie('token');
    res.json(buildResp(200, "User logged out successfully", [], []));
}


module.exports = {
    register,
    login,
    logout
}