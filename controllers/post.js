
const postModel = require("../models/PostModel");
const userModel = require("../models/userModels");
const JWT = require('jsonwebtoken');
const moment = require('moment-timezone');
const cloudinary = require("../middleware/cloudnary");
const { transporter } = require('../middleware/nodemailer');

//Get Admin details by email




// const Register = (req, res) => {
//     const Email = req.body.Email;
//     const Password = req.body.Password;
//     const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
//     const PhoneNumber = req.body.PhoneNumber;
//     const UserName = req.body.UserName;
//     const userSave = new userModel({
//         Email: Email,
//         PhoneNumber: PhoneNumber,
//         UserName: UserName,
//         Password: Password,
//         Created_On: Created_On,
//         followers: [],
//         following: [],
//         Posts: []
//     });
//     userModel.find({ Email: Email }, function (err, result) {
//         if (err) {
//             res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
//         } else {
//             if (result.length === 0) {
//                 userSave.save(function (err, result) {
//                     if (err) {
//                         res.send({ statusCode: 400, message: "Failed" });
//                     } else {
//                         res.send({ statusCode: 200, message: "Registered Successfully" });
//                     }
//                 });
//             } else {
//                 res.send({ statusCode: 400, message: "Email Already Exist" });
//             }
//         }
//     });


// }




// const UpdatedUsers = async (req, res) => {

//     const id = req.params.id;
//     const PhoneNumber = req.body.PhoneNumber;
//     const status = req.body.status;
//     const UserName = req.body.UserName;
//     const Email = req.body.Email;
//     const Password = req.body.Password
//     const District = req.body.District
//     const Modified_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");

//     if (req?.file === undefined) {
//         userModel.findById({ _id: id }, function (err, result) {
//             if (err) {
//                 res.send({ statusCode: 400, message: "Failed" });
//             } else {
//                 userModel.findOneAndUpdate({ _id: id },
//                     {
//                         $set: {
//                             PhoneNumber: PhoneNumber,
//                             Password: Password,
//                             status: status,
//                             UserName: UserName,
//                             Email: Email,
//                             District: District,
//                             Modified_On: Modified_On
//                         }
//                     }, function (err, result) {
//                         if (err) {
//                             res.send({ statusCode: 400, message: "Failed" });
//                         } else {
//                             res.send({ statusCode: 200, message: "Updated Successfully" });
//                         }
//                     });
//             }
//         });
//     } else {
//         const imagesUrl = await cloudinary.uploader.upload(req.file.path, { width: 185, height: 185, crop: "fill" });

//         userModel.findById({ _id: id }, function (err, result) {
//             if (err) {
//                 res.send({ statusCode: 400, message: "Failed" });
//             } else {
//                 userModel.findOneAndUpdate({ _id: id },
//                     {
//                         $set: {
//                             ProfileImage: imagesUrl.url,
//                             PhoneNumber: PhoneNumber,
//                             Password: Password,
//                             status: status,
//                             UserName: UserName,
//                             Email: Email,
//                             District: District,
//                             Modified_On: Modified_On
//                         }
//                     }, function (err, result) {
//                         if (err) {
//                             res.send({ statusCode: 400, message: "Failed" });
//                         } else {
//                             res.send({ statusCode: 200, message: "Updated Successfully" });
//                         }
//                     });
//             }
//         });
//     }
// };

const userPost = async (req, res) => {
    const userId = req.body.userId;
    const UserName = req.body.UserName;
    const Email = req.body.Email;
    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");
    // const comments = req.body.comments;
    // const likes = req.body.userId;
    // const UserName = req.body.UserName;
    var imageUrlList = [];
    for (let i = 0; i < req.files.length; i++) {
        var result = await cloudinary.uploader.upload(req.files[i].path, { width: 640, height: 640, crop: "scale", format: 'webp' });
        imageUrlList.push(result.url);
    };
    if (imageUrlList && userId && UserName && Created_On && Email) {
        const postSave = new postModel({
            imgOrvideos: imageUrlList,
            userId: userId,
            UserName: UserName,
            Created_On: Created_On,
            Email: Email,
            comments: [],
            likes: []
        });
        postSave.save(function (err, result) {
            if (err) {
                res.send({ statusCode: 400, message: err });
            } else {
                res.send({ statusCode: 200, message: "Registered Successfully" });
            }
        });
    } else {
        res.send({ statusCode: 400, message: "All Fields required" });
    }
}
const GetPostByUserId = (req, res) => {
    const Id = req.params.Id;
    postModel.find({ userId: Id }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            if (result.length === 0) {
                res.send([])
            } else {
                res.send(result)
            }
        }
    });
}
const getAllPost =  function(req, res) {
  

    postModel.find({}, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            if (result.length === 0) {
                res.send([])
            } else {
                
                res.send(result)
            }
        }
    });
}

function FeedS(req, res) {
    const userId = req.params.Id
    var data = []
    postModel.find({}, function (err, datas) {
        if (err) {
            res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
        } else {
            if (datas.length === 0) {
                res.send([])
            } else {
                //    res.send(datas)
                userModel.find({
                    _id: userId
                }, function (err, result) {
                    if (err) {
                        res.send({ statusCode: 400, message: "There was a problem adding the information to the database." });
                    } else {
                        datas?.forEach(val => {
                            if (result[0]?.following?.find(value => value.UserId === val.userId)) {
                                data.push(val)
                            }
                        })
                        res.send({ statusCode: 200, data: data });

                    }
                });
            }
        }
    });
}
const like = (req, res) => {
    const PostId = req.body.PostId;
    const likedUserId = req.body.likedUserId;
    const Created_On = moment().tz('Asia/Kolkata').format("DD-MM-YYYY hh:mm A");

    const like = {
        likedUserId: likedUserId,
        Created_On: Created_On
    }

    postModel.find({ _id: PostId }, function (err, result) {
        if (err) {
            res.send({ statusCode: 400, message: err });
        } else {
            // var newfollowing = {...result.following, userfollow}
            if (result.length !== 0) {
                result[0]?.likes?.find(val => val.likedUserId === likedUserId) ?
                    postModel.findOneAndUpdate({ _id: PostId },
                        {
                            $pull: {
                                likes: {
                                    likedUserId: likedUserId,
                                    Created_On: result[0]?.likes?.find(val => val.likedUserId === likedUserId)[0]?.Created_On
                                },
                            }
                        }, function (err2, result2) {
                            if (err2) {
                                res.send({ statusCode: 400, message: "Failed" });
                            } else {
                                res.send({ statusCode: 200, message: "unLiked Successfully" });
                            }
                        })
                    :
                    postModel.findOneAndUpdate({ _id: PostId },
                        {
                            $push: {
                                likes: like,
                            }
                        }, function (err, result) {
                            if (err) {
                                res.send({ statusCode: 400, message: err });
                            } else {
                                // var newfollowers = {...result.followers, userfollowed}
                                res.send({ statusCode: 200, message: "liked Successfully" });
                            }
                        })
            } else {
                res.send({ statusCode: 400, message: "Post not Exist" });
            }

        }
    });
}



module.exports = {
    FeedS,
    like,
    userPost,
    getAllPost,
    GetPostByUserId,

};