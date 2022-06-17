
const userModel = require("../models/userModels");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email





//login for admin and vendors
const loginValidate = (req, res) => {

    const Email = req.body.Email;
    const Password = req.body.Password;

    userModel.findOne({ Email: Email, Password: Password }, function (err, result) {
        if (result === null) {
         
        } else if (err) {
            res.send({ statusCode: 400, message: "error" });
        } else {
            const token = JWT.sign({
                id: result._id,
                Email : result.Email
            }, 'secret123', { expiresIn:  120 * 60 * 96 })
            res.send({ statusCode: 200, message: "Login Succeed",userId:result._id, token: token });
        }
    });

};

//verify token
const verifyToken = (req, res) => {

    const token = req.params.token;
    const decodeToken = JWT.decode(token);
    userModel.findById({ _id: decodeToken.id }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "Failed" });
        } 
        if(result===null) {
            res.send({statusCode : 400,message : "Invalid token"});
        }else{
            const userdata={
                UserId:result?._id,
                ProfileImage:result?.ProfileImage ,
                PhoneNumber:result?.PhoneNumber ,
                status:result?.status ,
                UserName:result?.UserName ,
                Password:result?.Password,
                Email:result?.Email,
                followersCount:result?.followers.length,
                followingCount:result?.following.length,
                followers:result?.followers,
                following:result?.following,
                Created_On:result?.Created_On,
                District:result?.District,
                Modified_On:result?.Modified_On
            }
            if(decodeToken.exp < Date.now()/1000){
                res.send({statusCode : 400,message : "Invalid token"});
            }else{
                res.send({statusCode : 200, result : userdata, type : 'user'});
            }  
        }
    });

};




module.exports = {
    loginValidate,
    verifyToken,
};