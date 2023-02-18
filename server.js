require("dotenv").config()
const express =  require('express')
const app = express();

const path = require("path")
const cors = require("cors");
const corsOPtion = require("./config/corsOPtion")

const verifyJWT = require("./middewares/verifyJWT");
const cookieParser = require('cookie-parser')
const credentials = require('./middewares/credentials')


const mongoose = require('mongoose')
const connectDb = require('./config/dbConfig')
const PORT = process.env.PORT || 5000;


//connect to database
connectDb();

//middlewares

app.use(credentials) //for header-authorization 
app.use(cors(corsOPtion)) //Cross Origin Resource Sharing
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false })) //built-in middleware to handle url-encoded data(form data)
app.use(express.json());//built-in middleware to handle json data


//third-party middleware
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "/public"))); //serve static file



//Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// app.use(verifyJWT);
app.use('/projects', verifyJWT, require('./routes/projects'));

//if route requested doesn't exist
app.all("*", (req, res) =>{
  res.status(404);
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, "public", "404.html"));
  }
  else if(req.accepts(json)){
    res.json({error: "404 not found"});
  }
  else{
    res.type("txt").send("404 not found")
  }
});

//error handling middleware
app.use(function(err, req, res, next){
  res.status(500).send(err.message);
})


mongoose.connection.once('open', () => {
  console.log('connected to mongodb');
  app.listen(PORT, ()=> console.log('app is running on port 5000'));
})

