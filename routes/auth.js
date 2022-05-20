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
    UpdatedUsers,
    Register,
    UserList,
    getUsersbyId,
    usersFollow,
    UserFollowingList,
    UserFollowersList,
    usersUnFollow
} = require('../controllers/users')





//Login & Forgot password API
router.get("/verifytoken/:token", verifyToken);
//login for admin and vendors
router.post("/login/validate", loginValidate);
router.post("/user/register", Register);
router.get("/user/list", UserList);
router.get("/users/list/:Id", getUsersbyId);
router.put("/user/update/:id",upload.single("file"),UpdatedUsers)
router.post("/user/follow",usersFollow)
router.post("/user/Unfollow",usersUnFollow)
router.get("/user/following/:Id",UserFollowingList)
router.get("/user/follower/:Id",UserFollowersList)
module.exports = router;