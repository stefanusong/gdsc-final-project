const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'username is required'],
        minLength: [5, 'username must be at least 5 characters'],
        maxLength: [20, 'username must be at most 20 characters'],
    },
    userEmail: {
        type: String,
        required: [true, 'email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    userPassword: {
        type: String,
        required: [true, 'password is required']
    },
}, {
    timestamps: true
}
);

const User = mongoose.model('User', UserSchema);

module.exports = User;