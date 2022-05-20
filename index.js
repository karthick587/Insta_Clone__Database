const express = require("express");
const db = require('./config/db');
const app = express();

app.use(express.json());
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,       
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
const authRoute = require("./routes/auth");

app.use('/api',authRoute);


app.listen(3001, () => {
  console.log("Server is running at port 3001");
});

