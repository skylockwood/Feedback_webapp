var mongoose = require('mongoose');
var CustomerVisit = mongoose.model('CustomerVisit')
var LabVisit = mongoose.model('LabVisit')
module.exports = (function(){
    return{
        getLabCharts: function(req,res){
            labChartData = {
                verticalData:{},
                verticalDataOther:{},
                visitsData:{},
                monthlyVerticalsData:{},
                monthlyVerticalsDataOther:{},
                usecases:{}
            }
            var acceptable = ['Manufacturing','Energy and Utilities','Life Sciences and Healthcare','Travel and Transport Logistics']
            LabVisit.find({date:{$gte:req.query.start, $lte:req.query.end}},function(err,visits){
                if(err){
                    res.json({status:false,error:err.message})
                }else{                   
                    for(i in visits){
                        var name = "";
                        var month = visits[i].date.getMonth();
                        if(visits[i].where == 'lab'){
                             name = visits[i].location;
                        }else{
                            name = visits[i].location + " Outbound";
                        }
                        if(labChartData.visitsData[name]){
                            labChartData.visitsData[name].total++
                            labChartData.visitsData[name].monthly[month]++
                        }else{
                            labChartData.visitsData[name]={
                                total:1, 
                                monthly:[0,0,0,0,0,0,0,0,0,0,0,0]
                            }
                            labChartData.visitsData[name].monthly[month]++;
                        }
                        
                        for(var v=0;v<visits[i].vertical.length;v++){
                            if(acceptable.includes(visits[i].vertical[v].vertical)){
                                if(labChartData.monthlyVerticalsData[visits[i].vertical[v].vertical]){
                                    labChartData.monthlyVerticalsData[visits[i].vertical[v].vertical][month]++
                                    labChartData.verticalData[visits[i].vertical[v].vertical]++
                                }else{
                                    labChartData.monthlyVerticalsData[visits[i].vertical[v].vertical]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labChartData.monthlyVerticalsData[visits[i].vertical[v].vertical][month]=1
                                    labChartData.verticalData[visits[i].vertical[v].vertical]=1
                                }
                            }else{
                                if(labChartData.monthlyVerticalsDataOther[visits[i].vertical[v].value]){
                                    labChartData.monthlyVerticalsDataOther[visits[i].vertical[v].value][month]++
                                    labChartData.verticalDataOther[visits[i].vertical[v].value]++
                                }else{
                                    labChartData.monthlyVerticalsDataOther[visits[i].vertical[v].value]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labChartData.monthlyVerticalsDataOther[visits[i].vertical[v].value][month]=1
                                    labChartData.verticalDataOther[visits[i].vertical[v].value]=1
                                } 
                            }
                        }
                    }
                    var locations =[];
                    var numberOfVisits=[];
                    var monthlyVisits = []
                    for(loc in labChartData.visitsData){
                        locations.push(loc);
                        numberOfVisits.push(labChartData.visitsData[loc].total)
                        monthlyVisits.push(labChartData.visitsData[loc].monthly)
                    }
                    labChartData.visitsData = {
                        locations:locations,
                        visits:numberOfVisits,
                        drilldown:monthlyVisits
                    }

                    var monthlyDataNames = [];
                    var monthlyDataValues = [];
                    for(vert in labChartData.monthlyVerticalsData){
                        monthlyDataNames.push(vert)
                        monthlyDataValues.push(labChartData.monthlyVerticalsData[vert])
                    }
                    labChartData.monthlyVerticalsData = {
                        names: monthlyDataNames,
                        values: monthlyDataValues
                    }

                    var monthlyDataNamesOther = [];
                    var monthlyDataValuesOther = [];
                    for(vert in labChartData.monthlyVerticalsDataOther){
                        monthlyDataNamesOther.push(vert)
                        monthlyDataValuesOther.push(labChartData.monthlyVerticalsDataOther[vert])
                    }
                    labChartData.monthlyVerticalsDataOther = {
                        names: monthlyDataNamesOther,
                        values: monthlyDataValuesOther
                    }
                    
                    CustomerVisit.find({date:{$gte:req.query.start, $lte:req.query.end}},function(err,c_visits){
                        if(err){
                            res.json({status:false,err:err})
                        }else{
                            for(i in c_visits){
                                for(var j=0;j<c_visits[i].usecase.length;j++){    
                                    labChartData.usecases[c_visits[i].usecase[j]] ? 
                                        labChartData.usecases[c_visits[i].usecase[j]]++ :
                                        labChartData.usecases[c_visits[i].usecase[j]]=1
                                }   
                            }
                            var usecaseNames = []
                            var usecaseValues = []
                            for(name in labChartData.usecases){
                                usecaseNames.push(name)
                                usecaseValues.push(labChartData.usecases[name])
                            }
                            labChartData.usecases={
                                names:usecaseNames,
                                values:usecaseValues
                            }
                            res.json({status:true, charts:labChartData})
                        }
                    })  
                }
            })
        }
    }
})()
