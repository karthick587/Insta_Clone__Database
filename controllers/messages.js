
const messageModel = require("../models/Messages");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email


const createmessage = (req, res) => {

    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const message = new messageModel({
        ConversationId: req.body.ConversationId,
        text: req.body.text,
        Created_On: Created_On
    });
    message.save(function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "Failed" });
        } else {
            res.send({ statusCode: 200, message: "Registered Successfully" });
        }
    });
}






const getMessgaes = (req, res) => {
    const Id = req.params.Id;
    messageModel.find({ ConversationId: Id }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            if (result.length === 0) {
                res.send({ message: "No Records Found" })
            } else {
                res.send(result)
            }
        }
    });
}






module.exports = {

    createmessage,
    getMessgaes,

};