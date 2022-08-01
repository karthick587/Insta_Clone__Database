const express = require("express");
const db = require('./config/db');
const app = express();

app.use(express.json());
const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoute = require("./routes/auth");
// const { find } = require("./models/PostModel");

app.use('/api', authRoute);







// listen for 'new-comment' event on channel 1, 2 and 3

// const Pusher2 = require('pusher-js');

// const pusher2 = new Pusher2('d9259f061ae07969923f', {
//   cluster: 'ap2'
// });

// const channel = pusher2.subscribe('chat');















//socket io 
// npm npm i socket.io
// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   }
// })
// let users = []

// const adduser = (userId, socketId) => {
//   users.push({ userId, socketId })
// }

// const removeruser = (id) => {
//   users = users.filter(user => user.socketId !== id)
// }
// const getUser=(userId)=>{
// return users.find(users=>users.userId===userId)
// }
// io.on("connection", (socket) => {
//   console.log("a user connected")
// //add user and get ids
//   socket.on("adduser", userId => {
//     adduser(userId, socket.id)
//     io.emit("getUser", users)
//   })
//   //send message
//   socket.on("sendMessage",({senderId,receiverId,text})=>{
//     const user=getUser(receiverId)
//     io.to(user.socketId).emit("getMessage",{
//       senderId,
//       text,
//     })
//   })
// // remove stored user
//   socket.on("disconnect", () => {
//     console.log("a user disconnected!")
//     removeruser(socket.id);
//     io.emit("getUser", users)
//   })
// })



app.listen(3001, () => {
  console.log("Server is running at port 3001");
});



