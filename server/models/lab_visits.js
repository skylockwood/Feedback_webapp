var mongoose = require('mongoose');
var LabVisitSchema = new mongoose.Schema({
    customer:{type:String,required:true},
    date:{type:Date,required:true},
    arranged:{type:String,required:true},
    where:{type:String,required:true},
    vertical:{type:[],required:true},
    who:{type:String,required:true},
    usecase:{type:[],required:true},
    interest:{type:String,required:true},
    next:{type:String,required:true},
    excalibur:{type:String,required:true},
    location:{type:String,required:true},
    customer_id:{type:String}
},{timestamps:true})

mongoose.model('LabVisit',LabVisitSchema)