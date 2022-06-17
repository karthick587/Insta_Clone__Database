
const ConversationModel = require("../models/ConversationModel");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email


const createConversation = (req, res) => {

    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const Conversation = new ConversationModel({
        Members: [req.body.senderId, req.body.receiverId],
        Created_On: Created_On
    });
    Conversation.save(function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "Failed" });
        } else {
            res.send({ statusCode: 200, message: "Registered Successfully" });
        }
    });
}

const getConvbyId = (req, res) => {

    const Id = req.params.Id;

    ConversationModel.find({
        Members: { $in: [Id] },
    }, function (err, result) {

        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            res.send(result);
        }
    });
}

const getConvbySenderreceiverId = (req, res) => {

    const userId = req.body.userId;
    const receiverId = req.body.receiverId;
    ConversationModel.find({
        Members: { $all: [userId, receiverId] },
    }, function (err, result) {

        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            res.send(result);
        }
    });
}



module.exports = {

    createConversation,
    getConvbySenderreceiverId,
    getConvbyId,

};