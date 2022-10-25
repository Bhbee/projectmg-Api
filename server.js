require("dotenv").config()
const express =  require('express')
const path = require("path")
const verifyJWT = require("./middewares/verifyJWT");
const cookie = require('cookie-parser')
const credentials = require('./middewares/credentials')
const cors = require("cors");
const corsOPtion = require("./config/corsOPtion")
const db = require("./models");
const { json } = require('sequelize');
const PORT = process.env.PORT || 5000;
const app = express();


//middlewares

app.use(credentials) //for header-authorization 
app.use(cors(corsOPtion)) //Cross Origin Resource Sharing
app.use(express.json()); //built-in middleware to handle json data
app.use(express.urlencoded({ extended: true })) //built-in middleware to handle url-encoded data(form data)
app.use(express.static(path.join(__dirname, "/public"))); //serve static file

//third-party middleware
app.use(cookie())

//Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.use(verifyJWT);
app.use('/projects', require('./routes/projects'));

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

// connect to database:
db.sequelize.sync({force: false}).then(()=>{
  app.listen(PORT, ()=> {
    console.log('app is running on port 5000');
  });
});



