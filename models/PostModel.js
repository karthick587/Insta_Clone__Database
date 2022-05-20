const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({

    imgOrvideos: {
        data: Buffer,
        contentType: String
    },
    userId: {
        type: Number,
    },
    UserName: {
        type: String,
    },
    comments: {
        type: String,
    },
    likes: {
        type: String,
    },
    Email: {
        type: String
        // Street: {
        //     type: String
        // },
        // City: {
        //     type: String
        // },
        // District: {
        //     type: String
        // },
        // Postalcode : {
        //     type : Number
        // }
    },
    Created_On: {
        type: String,
    },
    Modified_On: {
        type: String,
    }

});

const collectionName = 'posts';

module.exports = mongoose.model('posts', PostSchema, collectionName);