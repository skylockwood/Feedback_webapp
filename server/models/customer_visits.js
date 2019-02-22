var mongoose = require('mongoose');
var validator = require('node-mongoose-validator');
var CustomerVisitSchema = new mongoose.Schema({
    name: {type:String, required:true},
    company:{type:String, required:true},
    designation:{type:String, required:true},
    email:{type:String, required:true},
    objective:{type:String, required:true},
    usecase:{type:[], required:true},
    enhancement:{type:String, required:true},
    recommendations:{type:String, required:true},
    star:{type:Number,min:1,max:5,required:true},
    location:{type:String, required:true},
    date:{type:Date}
},{timestamps:true})

mongoose.model('CustomerVisit',CustomerVisitSchema)