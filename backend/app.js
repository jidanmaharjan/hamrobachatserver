const express = require("express");
const app = express();
const cors = require("cors");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const errorMiddleware = require('./middlewares/error')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(
    cors({
      origin: ['http://localhost:3000','https://bachatsathi.ml'],
      credentials: true
    })
  )



app.get('/', (req, res)=>{
    
    res.sendFile(path.resolve(__dirname,'index.html'))
})

//Import all routes
const auth = require('./routes/auth');
const bachat = require('./routes/bachat');


app.use('/api/v1', auth)
app.use('/api/v1', bachat)

// Middleware to handle error messages
app.use(errorMiddleware);

module.exports = app