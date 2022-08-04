const express = require("express");
const db = require("./model/db_connect");
const signup = require("./controllers/signupAndLogin");
const route = require("./routers/routes");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
// const public = require("./public/index.html");

var app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
 

app.use(express.json());

app.use('/', route);  

app.listen(8080, () => {
    console.log("server is running......");
}); 
