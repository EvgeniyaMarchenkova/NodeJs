const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    password: String,
    email: String
});

module.exports.User = mongoose.model('User', UsersSchema);