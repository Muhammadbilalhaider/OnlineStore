const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    profilePic: {
        type: String,
        required: true,
        maxLength: 300 * 300 * 5
    },
    password: {
        required: true,
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);
