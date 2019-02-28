var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var excel = require('exceljs');
app.use(session({
    secret: 'fancysecret',
    resave: true,
    saveUninitialized: true,
    cookie:{secure:false}
}))

app.use(express.static(path.join(__dirname+'/client')))
app.use(express.static(path.join(__dirname+'/node_modules')))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app)

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log("listening on", PORT)

