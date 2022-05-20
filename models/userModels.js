const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    UserId: {
        type: String,
    },
    ProfileImage: {
        data: Buffer,
        contentType: String
    },
    PhoneNumber: {
        type: Number,
    },
    status: {
        type: String,
    },
    District: {
        type: String,
    },
    UserName: {
        type: String,
    },
    Password: {
        type: String,
    },
    Email: {
        type: String
    },
    followers: {
        type: Array
    },
    following: {
        type: Array
    },
    Posts: {
        type: Array
    },
    Created_On: {
        type: String,
    },
    Modified_On: {
        type: String,
    }
});

const collectionName = 'users';

module.exports = mongoose.model('users', UserSchema, collectionName);