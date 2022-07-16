const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({

    ConversationId: {
        type: String
    },
    sentBy:{
        type: String
    },
    text: {
        type: String
    },
    files: {
        data: Buffer,
        contentType: String
    },
    Created_On: {
        type: String,
    },
    Modified_On: {
        type: String,
    }

});

const collectionName = 'Messages';

module.exports = mongoose.model('Messages', MessageSchema, collectionName);