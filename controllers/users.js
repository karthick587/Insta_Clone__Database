
const userModel = require("../models/userModels");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email


const UserList = (req, res) => {

    userModel.find({}, function (err, result) {
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

const Register = (req, res) => {
    const Email = req.body.Email;
    const Password = req.body.Password;
    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const PhoneNumber = req.body.PhoneNumber;
    const UserName = req.body.UserName;
    const userSave = new userModel({
        Email: Email,
        PhoneNumber: PhoneNumber,
        UserName: UserName,
        Password: Password,
        Created_On: Created_On,
        followers: [],
        following: [],
        Posts: []
    });
    userModel.find({ Email: Email }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            if (result.length === 0) {
                userSave.save(function (err, result) {
                    if (err) {
                        res.send({ statusCode: 400, message: "Failed" });
                    } else {
                        res.send({ statusCode: 200, message: "Registered Successfully" });
                    }
                });
            } else {
                res.send({ statusCode: 400, message: "Email Already Exist" });
            }
        }
    });


}

const getUsersbyId = (req, res) => {

    const Id = req.params.Id;

    userModel.find({
        _id: Id
    }, function (err, result) {
        const userdata = {
            UserId: result[0]?._id,
            ProfileImage: result[0]?.ProfileImage,
            PhoneNumber: result[0].PhoneNumber,
            status: result[0].status,
            UserName: result[0].UserName,
            Password: result[0].Password,
            Email: result[0].Email,
            followersCount: result[0].followers.length,
            followingCount: result[0].following.length,
            followers: result[0].followers,
            following: result[0].following,
            Posts: result[0].Posts,
            District: result[0]?.District,
            Created_On: result[0].Created_On,
            Modified_On: result[0].Modified_On
        }
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            res.send(userdata);
        }
    });
}



const UpdatedUsers = async (req, res) => {

    const id = req.params.id;
    const PhoneNumber = req.body.PhoneNumber;
    const status = req.body.status;
    const UserName = req.body.UserName;
    const Email = req.body.Email;
    const Password = req.body.Password
    const District = req.body.District
    const Modified_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");

    if (req?.file === undefined) {
        userModel.find({ _id: id }, function (err, result) {
            if (err) {
                res.send({ statusCode: 400, message: err });
            } else {
                userModel.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            PhoneNumber: PhoneNumber,
                            Password: Password,
                            status: status,
                            UserName: UserName,
                            Email: Email,
                            District: District,
                            Modified_On: Modified_On
                        }
                    }, function (err, result) {
                        if (err) {
                            res.send({ statusCode: 400, message: err });
                        } else {
                            res.send({ statusCode: 200, message: "Updated Successfully" });
                        }
                    });
            }
        });
    } else {
        const imagesUrl = await cloudinary.uploader.upload(req.file.path, { width: 185, height: 185, crop: "fill" });

        userModel.find({ _id: id }, function (err, result) {
            if (err) {
                res.send({ statusCode: 400, message: err });
            } else {
                userModel.findOneAndUpdate({ _id: id },
                    {
                        $set: {
                            ProfileImage: imagesUrl.url,
                            PhoneNumber: PhoneNumber,
                            Password: Password,
                            status: status,
                            UserName: UserName,
                            Email: Email,
                            District: District,
                            Modified_On: Modified_On
                        }
                    }, function (err, result) {
                        if (err) {
                            res.send({ statusCode: 400, message: err });
                        } else {
                            res.send({ statusCode: 200, message: "Updated Successfully" });
                        }
                    });
            }
        });
    }
};
const usersFollow = (req, res) => {
    const UserId = req.body.UserId;
    const ToFollowId = req.body.ToFollowId;
    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const userfollow = {
        UserId: ToFollowId,
        Status: "pending",
        Created_On: Created_On
    }
    const userfollowed = {
        UserId: UserId,
        Status: "pending",
        Created_On: Created_On
    }
    userModel.findById({ _id: UserId }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: err });
        } else {
            // var newfollowing = {...result.following, userfollow}
            userModel.findOneAndUpdate({ _id: UserId },
                {
                    $push: {
                        following: userfollow,
                    }
                }, function (err, result) {
                    if (err) {
                        res.send({ statusCode: 400, message: err });
                    } else {
                        // var newfollowers = {...result.followers, userfollowed}
                        userModel.findOneAndUpdate({ _id: ToFollowId },
                            {
                                $push: {
                                    followers: userfollowed,
                                }
                            }, function (err, result) {
                                if (err) {
                                    res.send({ statusCode: 400, message: "Failed" });
                                } else {
                                    res.send({ statusCode: 200, message: " Successfully" });
                                }
                            });
                    }
                });
        }
    });
}

const usersUnFollow = (req, res) => {
    const UserId = req.body.UserId;
    const ToUnFollowId = req.body.ToUnFollowId;
    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    const userUnfollow = {
        UserId: ToUnFollowId,
    }
    const userfollowed = {
        UserId: UserId,
        Status: "pending",
        Created_On: Created_On
    }
    userModel.findById({ _id: UserId }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: err,stage:"1" });
        } else {
            // var newfollowing = {...result.following, userfollow}
            userModel.findOneAndUpdate({ _id: UserId },
                {
                    $pull: {
                        following: userUnfollow,
                    }
                }, function (err, result) {
                    if (err) {
                        res.send({ statusCode: 400, message: err ,stage:"2" });
                    } else {
                        // var newfollowers = {...result.followers, userfollowed}
                        userModel.findOneAndUpdate({ _id: ToUnFollowId },
                            {
                                $pull: {
                                    followers: userfollowed,
                                }
                            }, function (err, result) {
                                if (err) {
                                    res.send({ statusCode: 400, message: "Failed" });
                                } else {
                                    res.send({ statusCode: 200, message: " Successfully" });
                                }
                            });
                    }
                });
        }
    });
}

const UserFollowingList = (req, res) => {
    const userId = req.params.Id

    userModel.find({ "followers.UserId": userId }, function (err, result) {
        // var data=result.filter(val=>val.followers[0]?.UserId===userId)
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            //   var data=result.map(val=>{ if(val.followers?.UserId===userId){return val}} )
            res.send(result)

        }
    });
}
const UserFollowersList = (req, res) => {
    const userId = req.params.Id

    userModel.find({ "following.UserId": userId }, function (err, result) {
        // var data=result.filter(val=>val.followers[0]?.UserId===userId)
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            //   var data=result.map(val=>{ if(val.followers?.UserId===userId){return val}} )
            res.send(result)

        }
    });
}



module.exports = {

    UserFollowersList,
    Register,
    UserList,
    getUsersbyId,
    UpdatedUsers,
    usersFollow,
    UserFollowingList,
    usersUnFollow

};