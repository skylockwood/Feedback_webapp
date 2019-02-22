var mongoose = require('mongoose');
var Excel = require('exceljs')
var Visit = mongoose.model('CustomerVisit')
var User = mongoose.model('User')
module.exports = (function(){
    return{
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
            Visit.find({date:{$gte:req.query.start,$lte:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{                    
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
            for(x in req.body.usecase)usecases.push(req.body.usecase[x]);
            var visit = new Visit({
                name:req.body.name,
                company:req.body.company,
                designation:req.body.designation,
                email:req.body.email,
                objective:req.body.objective,
                usecase:usecases,
                enhancement:req.body.enhancement,
                recommendations:req.body.recommendations,
                star:req.body.star,
                location:req.session.name,
                date:req.body.date.setUTCHours(0)
            })
            Visit.find(visit,function(err,data){
                if(err){
                    res.json({status:false,error:err.message})
                }
                if(data.length==0){
                    visit.save(function(err,data){
                        if(err){
                            res.json({status:false,error:err.message})
                        }else{
                            res.json({status:true, data:data})
                        }
                    })
                }else{
                    res.json({status:false, error:"This visit has already been submitted"});
                }
            })
        },
        addFromFile: function(req,res){
            var arrOfVisits=[]
            var workbook = new Excel.Workbook(); 
            workbook.xlsx.readFile(req.body.path).then(function() {
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
                            location:"Redmond",
                            date:row.values[2]
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
