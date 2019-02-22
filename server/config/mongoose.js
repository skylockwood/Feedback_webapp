var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/');
var path = require('path');
var fs = require('fs');
var models_path = path.join(__dirname+'./../models');

fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js')>=0){
        require(models_path+'/'+file)
    }
})