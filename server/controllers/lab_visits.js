var mongoose = require('mongoose');
var Excel = require('exceljs');
var Visit = mongoose.model('LabVisit');
module.exports = (function(){
    return{
        range: function(req,res){
            Visit.find({date:{$gte:req.query.start, $lt:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{
                    var count=0;
                    for(var i=0;i<visits.length;i++){
                        if(visits[i].excalibur.includes('OHCLP')) count++;
                    }
                    res.json({status:true, visits:visits, count:count})
                }
            })
        },
        add: function(req,res){
            var usecases = [],verticals=[];
            for(x in req.body.usecase)usecases.push(req.body.usecase[x]);
            for(x in req.body.vertical){
                if(parseInt(x.slice(-1)) > 4){
                    verticals.push({vertical:"Other", value:req.body.vertical[x]})
                }else{
                    verticals.push({vertical:req.body.vertical[x]});
                }
            }
            var visit = new Visit({
                customer:req.body.customer,
                date:req.body.date,
                arranged:req.body.arranged,
                where:req.body.where,
                vertical:verticals,
                who:req.body.who,
                usecase:usecases,
                interest:req.body.interest,
                next:req.body.next,
                excalibur:req.body.excalibur,
                location:req.session.name
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
                    res.json({status:false, error:"This visit has already been submitted"})
                }
            })
        },
        addFromFile: function(req,res){
            var arrOfVisits =[]
            var workbook = new Excel.Workbook(); 
            workbook.xlsx.readFile(req.body.path).then(function() {
                var worksheet = workbook.getWorksheet('Sheet1');
                worksheet.eachRow(function(row, rowNumber) {
                    var verts = row.values[9].replace(/\s+/g, " ").trim().split(';').slice(0,-1);
                    var newVerts=[]
                    var acceptable = ['Manufacturing','Energy and Utilities','Life Sciences and Healthcare','Travel and Transport Logistics']
                    var others = ['internal', 'partners', 'telecom', 'retail'];
                    for(v in verts){
                        if(acceptable.includes(verts[v]))newVerts.push({vertical:verts[v]})
                        else{
                            if(others.includes(verts[v].toLowerCase())){
                                newVerts.push({vertical:"Other",value:(verts[v].charAt(0).toUpperCase()+verts[v].slice(1))})
                            }else{
                                newVerts.push({vertical:"Other",value:"Other"})
                            }                                  
                        } 
                    }
                    if(rowNumber>1){
                        var historicalVisit = new Visit({
                            customer:row.values[5],
                            date:row.values[6].setUTCHours(0),
                            arranged:row.values[7].text ? row.values[7].text : row.values[7],
                            where:row.values[8].replace(/\s+/g, " ").trim().split(' ').length == 2 ? "outbound":"lab",
                            vertical:newVerts,
                            who:row.values[10],
                            usecase:row.values[11].replace(/\s+/g, " ").trim().split(';').slice(0,-1),
                            interest:row.values[12],
                            next:row.values[13].text ? row.values[7].text : row.values[7],
                            excalibur:row.values[14].text ? row.values[7].text : row.values[7],
                            location:row.values[8].replace(/\s+/g, " ").trim().split(' ')[0]
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
        update: function(req,res){
            Visit.findById(req.body._id,function(err,data){
                if(err){
                    res.json({status:false,error:err})
                }else{
                    data.excalibur = req.body.excalibur
                    data.save(function(err,complete){
                        if(err){
                            res.json({status:false,error:err})
                        }else{
                            res.json({status:true,message:"Successful update",visit:data})
                        }
                    }) 
                }
            })
        },
        delete: function(req,res){
            Visit.remove(req.body._id,function(err,data){
                err ? res.json({status:false,error:err.message}) : res.json({status:true, message:"Deletion successful"})
            })
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