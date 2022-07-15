const express = require("express");
const cors = require('cors');
const postModel = require("../models/PostModel");
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
var clients = [];
// router.get('/status', function (request, response) {
//     const headers = {
//         'Content-Type': 'text/event-stream',
//         'Connection': 'keep-alive',
//         'Cache-Control': 'no-cache'
//     };
//     response.writeHead(200, headers);

//     // response.json({ clients: clients.length })
//     const data = `data: ${JSON.stringify(clients)}\n\n`;

//     response.write(data);
// });

var facts = [{
    id: "rdyhdtf",
    data:"rgddfh"
}];


var data = "Real-Time Update 1";
var number = 1;
// router.get('/server-sent-events', function (req, res) {

//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive'
//     });


//     res.write("data: " + "gdv" + "\n\n")

// })


// router.get('/status', (request, response) => response.json({clients: clients.length}));

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
    // clients=[...clients,newClient]

    // request.on('close', () => {
        
    //     clients = clients.filter(client => client.id !== clientId);
    // });
}
console.log(clients)
console.log(facts)

router.get('/events', eventsHandler);



function clientHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(clients)}\n\n`;

    response.write(data);

   

    // request.on('close', () => {
        
    //     clients = clients.filter(client => client.id !== clientId);
    // });
}

router.get('/client', clientHandler);






function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
}

async function addFact(request, respsonse, next) {
    const newFact = request.body;
    facts.push(newFact);
    respsonse.json(newFact)
    return sendEventsToAll(newFact);
}

router.post('/fact', addFact);

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