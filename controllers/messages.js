
const messageModel = require("../models/Messages");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email


var clients = [];

var facts = []
function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
    const data = `data: ${JSON.stringify(facts)}\n\n`;
    response.write(data);
    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };
    clients.push(newClient);
}

function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}





async function createmessage(req, res) {

    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const message = new messageModel({
        ConversationId: req.body.ConversationId,
        sentBy: req.body.sentBy,
        text: req.body.text,
        Created_On: Created_On
    });
    let data = {
        ConversationId: req.body.ConversationId,
        sentBy: req.body.sentBy,
        text: req.body.text,
        Created_On: Created_On
    }
    facts.push(data);

    message.save(function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "Failed" });
        } else {

            res.send({ statusCode: 200, message: "Registered Successfully" });
        }
    });
     sendEventsToAll(data)
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
    eventsHandler,
    createmessage,
    getMessgaes,

};