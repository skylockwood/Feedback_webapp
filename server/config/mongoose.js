var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/');
var path = require('path');
var fs = require('fs');
var models_path = path.join(__dirname+'./../models');

//Connects all the models that are used in this app to the Mongo database
fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js')>=0){
        require(models_path+'/'+file)
    }
})