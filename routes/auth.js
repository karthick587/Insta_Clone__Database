const express = require("express");
const cors = require('cors');

const app = express();

const router = express.Router();
app.use(router);

router.use(express.json());
app.use(cors());

const upload = require("../middleware/multer");

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors());



const {
    verifyToken,
    loginValidate,
} = require('../controllers/auth');


const {
    createConversation,
    getConvbySenderreceiverId,
    getConvbyId

} = require('../controllers/conversation');


const {
    createmessage,
    getMessgaes,
} = require('../controllers/messages');


const {
    UpdatedUsers,
    Register,
    UserList,
    getUsersbyId,
    usersFollow,
    UserFollowingList,
    UserFollowersList,
    usersUnFollow
} = require('../controllers/users')


const {
    userPost,
    getAllPost,
    GetPostByUserId,
    like,
    FeedS,
} = require('../controllers/post')


//Login & Forgot password API
router.get("/verifytoken/:token", verifyToken);


//login for admin and vendors
router.post("/login/validate", loginValidate);
router.post("/user/register", Register);



//post
router.post("/user/post", upload.array("files"), userPost);
router.get("/user/All/post", getAllPost);

router.get("/user/feed/:Id", FeedS);
router.get("/user/post/:Id", GetPostByUserId);
router.post("/user/post/like", like);


//conversation

router.post("/conv/add", createConversation)
router.get("/conv/byId/:Id", getConvbyId);
router.get("/conv/user&receiver/Id", getConvbySenderreceiverId);



//message

router.post("/message/send", createmessage)
router.get("/messages/:Id", getMessgaes);



//user
router.get("/user/list", UserList);
router.get("/users/list/:Id", getUsersbyId);
router.put("/user/update", upload.single("file"), UpdatedUsers)
router.post("/user/follow", usersFollow)
router.post("/user/Unfollow", usersUnFollow)
router.get("/user/following/:Id", UserFollowingList)
router.get("/user/follower/:Id", UserFollowersList)
module.exports = router;