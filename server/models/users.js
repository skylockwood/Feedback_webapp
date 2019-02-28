var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
    user:{type:String, required:true, index:{unique:true}},
    password:{type:String, required:true},
    level:{type:Number, required:true},
    _visits:[{type:mongoose.Schema.Types.ObjectId, ref:'Visits'}],
},{timestamps:true})
mongoose.model('User',UserSchema)