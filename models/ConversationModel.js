const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({

    Members: {
        type: Array
    },
    Created_On: {
        type: String,
    },
    Modified_On: {
        type: String,
    }

});

const collectionName = 'Conversation';

module.exports = mongoose.model('Conversation', ConversationSchema, collectionName);