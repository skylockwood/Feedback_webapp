var mongoose = require('mongoose');
var Excel = require('exceljs')
var Visit = mongoose.model('CustomerVisit')
var User = mongoose.model('User')
module.exports = (function(){
    return{
        //These functions query the database and do all the necessary business logic based on the
        // client side request
        
        index: function(req,res){
            Visit.find({},function(err,visits){
                if(err){
                    res.json({status:false, error:err});
                }else{
                    res.json({status:true,visits:visits})
                }
            })
        },
        range: function(req,res){
            Visit.find({date:{$gte:req.query.start, $lte:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{
                    res.json({status:true, visits:visits})
                }
            })
        },
        
        feedback: function(req,res){
            var headers = {startTime:"Start Time", completionTime:"Completion Time",Email:"Email", name:"Name", name2:"Name2",
            company:"Company",designation:"Designation/Role",email:"Email",objective:"Objective of the visit",usecase:"Usecases seen during visit",
            vertical:[{vertical:"Which vertical does it belong to?"}],who:"Who conducted the visit",usecase:"Which solutions were shared",interest:"Which area interested the customer most?",
            enhancement:"What could make the visit better?",recommendations:"Who would you recommend visit the lab",star:"Rating the lab received"}
            Visit.find({date:{$gte:req.query.start,$lte:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{   
                    visits.unshift(headers)               
                    res.json({status:true, visits:visits})
                }
            })
        },
        getVisits: function(req,res){
            Visit.find({date:{$gte:req.query.date,$lte:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{
                    res.json({status:true, visits:visits})
                }
            })
        },
        add: function(req,res){
            var usecases = [];
            for(x in req.body.usecase){
                usecases.push(req.body.usecase[x]);
            }
            var visit = new Visit({
                name:req.body.name? req.body.name : "Not Supplied",
                company:req.body.company? req.body.company : "Not Supplied",
                designation:req.body.designation? req.body.designation : "Not Supplied",
                email:req.body.email? req.body.email : "Not Supplied",
                objective:req.body.objective? req.body.objective : "Not Supplied",
                usecase:usecases,
                enhancement:req.body.enhancement? req.body.enhancement : "Not Supplied",
                recommendations:req.body.recommendations? req.body.recommendations : "Not Supplied",
                star:req.body.star? req.body.star : 0,
                location:req.session.name,
                date:req.body.date
            })
            Visit.find(visit,function(err,data){
                if(err){
                    res.json({status:false,error:err.message})
                }
                if(data.length==0){
                    visit.save(function(err,data){
                        if(err){
                            console.log("err:",err.message)
                            res.json({status:false,error:err.message})
                        }else{
                            res.json({status:true, data:data})
                        }
                    })
                }else{
                    console.log("err:",err.message)
                    res.json({status:false, error:"This visit has already been submitted"});
                }
            })
        },
        addFromFile: function(req,res){
            var paths = {
                "Redmond":'/home/ubuntu/Feedback-deploy/Feedback_webapp/client/RedmondCust.xlsx',
                "Noida":'/home/ubuntu/Feedback-deploy/Feedback_webapp/client/NoidaCust.xlsx'
            }
            var arrOfVisits=[]
            var workbook = new Excel.Workbook(); 
            workbook.xlsx.readFile(paths[req.body.path]).then(function() {
                var worksheet = workbook.getWorksheet('Sheet1');
                worksheet.eachRow(function(row, rowNumber) {
                    if(rowNumber>1){
                        var historicalVisit = new Visit({
                            name: row.values[5],
                            company: row.values[6],
                            designation:row.values[7],
                            email:row.values[8],
                            objective:row.values[9],
                            usecase:row.values[10].replace(/\s+/g, " ").trim().split(';').slice(0,-1),
                            enhancement:row.values[11],
                            recommendations:row.values[12],
                            star:row.values[13],
                            location:req.body.path,
                            date:row.values[2].setUTCHours(0,0,0,0)
                        });
                        arrOfVisits.push(historicalVisit);
                    }
                });
            })
            .then(function(){
                Visit.create(arrOfVisits,function(err,data){
                    if(err){
                        res.json({status:false,error:err.message})
                    }else{
                        res.json({status:true,data:data})
                    }
                })
            });
        },
        purge: function(req,res){
            Visit.remove({},function(err,data){
                if(err){
                    res.json({status:false, error:err.message});
                }else{
                    res.json({status:true, message:"Successful Purge"})
                }
            })
        }
    }
})()
