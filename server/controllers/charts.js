var mongoose = require('mongoose');
var CustomerVisit = mongoose.model('CustomerVisit')
var LabVisit = mongoose.model('LabVisit')
var puppeteer = require('puppeteer')
var fs = require('fs')
module.exports = (function(){
    return{
        //function that queryies the database and does all the business side logic once query
        // data is recieved from the client.
        getLabCharts: async function(req,res){
            const labChartData = {
                verticalData:{},
                verticalDataOther:{},
                usecases:{}
            }
            const labReportData = {
                monthlyCompareT:{
                    current:[0,0,0,0,0,0,0,0,0,0,0,0],
                    previous:[0,0,0,0,0,0,0,0,0,0,0,0],
                    outbound:{
                        current:[0,0,0,0,0,0,0,0,0,0,0,0],
                        previous:[0,0,0,0,0,0,0,0,0,0,0,0]
                    }
                },
                monthlyCompareV:{current:{},previous:{},outbound:{current:{},previous:{}}},
                monthlyCompareO:{current:{},previous:{}},
                visitsData:{lab:{},outbound:{}},
                visitsDataO:{lab:{},outbound:{}},
                ratings:{highest:[],lowest:{}}
            }
            //const acceptable = ['Manufacturing','Energy and Utilities','Life Sciences and Healthcare','Travel and Transport Logistics','RCPG']
            const others = ["Analyst","Internal","Partners"]
            try {
                const visits = await LabVisit.find({date:{$gte:req.query.start, $lte:req.query.end}}).exec()
                for(let visit of visits){
                    let name = visit.where == "lab" ? visit.location : visit.location+" Outbound";
                    let month = visit.date.getUTCMonth()<3?visit.date.getUTCMonth()+9:visit.date.getUTCMonth()-3
                    
                    for(let vertical of visit.vertical){
                        if(!name.includes("Outbound")){
                            if(!others.includes(vertical.value)){
                                labReportData.monthlyCompareT.current[month]++;
                                if(labReportData.monthlyCompareV.current[vertical.vertical]){
                                    labReportData.monthlyCompareV.current[vertical.vertical][month]++
                                    labChartData.verticalData[vertical.vertical]++
                                }else{
                                    labReportData.monthlyCompareV.current[vertical.vertical]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareV.current[vertical.vertical][month]=1
                                    labChartData.verticalData[vertical.vertical]=1
                                }
                                if(labReportData.visitsData.lab[name]){
                                    labReportData.visitsData.lab[name].total++
                                    labReportData.visitsData.lab[name].monthly[month]++
                                }else{
                                    labReportData.visitsData.lab[name]={
                                        total:1, 
                                        monthly:[0,0,0,0,0,0,0,0,0,0,0,0]
                                    }
                                    labReportData.visitsData.lab[name].monthly[month]++;
                                }
                            }else{
                                if(labReportData.monthlyCompareO.current[vertical.value]){
                                    labReportData.monthlyCompareO.current[vertical.value][month]++
                                    labChartData.verticalDataOther[vertical.value]++
                                }else{
                                    labReportData.monthlyCompareO.current[vertical.value]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareO.current[vertical.value][month]=1
                                    labChartData.verticalDataOther[vertical.value]=1
                                } 
                                if(labReportData.visitsDataO.lab[name]){
                                    labReportData.visitsDataO.lab[name].total++
                                    labReportData.visitsDataO.lab[name].monthly[month]++
                                }else{
                                    labReportData.visitsDataO.lab[name]={
                                        total:1, 
                                        monthly:[0,0,0,0,0,0,0,0,0,0,0,0]
                                    }
                                    labReportData.visitsDataO.lab[name].monthly[month]++;
                                }
                            }
                        }else{
                            if(!others.includes(vertical.value)){
                                labReportData.monthlyCompareT.outbound.current[month]++;
                                if(labReportData.monthlyCompareV.outbound.current[vertical.vertical]){
                                    labReportData.monthlyCompareV.outbound.current[vertical.vertical][month]++
                                    labChartData.verticalData[vertical.vertical]++
                                }else{
                                    labReportData.monthlyCompareV.outbound.current[vertical.vertical]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareV.outbound.current[vertical.vertical][month]=1
                                    labChartData.verticalData[vertical.vertical]=1
                                }
                                if(labReportData.visitsData.outbound[name]){
                                    labReportData.visitsData.outbound[name].total++
                                    labReportData.visitsData.outbound[name].monthly[month]++
                                }else{
                                    labReportData.visitsData.outbound[name]={
                                        total:1, 
                                        monthly:[0,0,0,0,0,0,0,0,0,0,0,0]
                                    }
                                    labReportData.visitsData.outbound[name].monthly[month]++;
                                }
                            }else{
                                if(labReportData.monthlyCompareO.outbound.current[vertical.value]){
                                    labReportData.monthlyCompareO.outbound.current[vertical.value][month]++
                                    labChartData.verticalDataOther[vertical.value]++
                                }else{
                                    labReportData.monthlyCompareO.outbound.current[vertical.value]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareO.outbound.current[vertical.value][month]=1
                                    labChartData.verticalDataOther[vertical.value]=1
                                } 
                                if(labReportData.visitsDataO.outbound[name]){
                                    labReportData.visitsDataO.outbound[name].total++
                                    labReportData.visitsDataO.outbound[name].monthly[month]++
                                }else{
                                    labReportData.visitsDataO.outbound[name]={
                                        total:1, 
                                        monthly:[0,0,0,0,0,0,0,0,0,0,0,0]
                                    }
                                    labReportData.visitsDataO.outbound[name].monthly[month]++;
                                }
                            }
                        }
                    }
                }
                let endDate = new Date(req.query.end)
                endDate.setUTCFullYear(endDate.getUTCFullYear()-1)
                const prevVisits = await LabVisit.find({date:{$gte:req.query.previous,$lt:endDate}}).exec()
                for(let pVisit of prevVisits){
                    let month = pVisit.date.getUTCMonth()<3?pVisit.date.getUTCMonth()+9:pVisit.date.getUTCMonth()-3
                    let name = pVisit.where == "lab" ? pVisit.location : pVisit.location+" Outbound";
                    for(let pVert of pVisit.vertical){
                        if(!name.includes("Outbound")){
                            if(!others.includes(pVert.value)){
                                labReportData.monthlyCompareT.previous[month]++;
                                if(labReportData.monthlyCompareV.previous[pVert.vertical]){
                                    labReportData.monthlyCompareV.previous[pVert.vertical][month]++
                                    labChartData.verticalData[pVert.vertical]++
                                }else{
                                    labReportData.monthlyCompareV.previous[pVert.vertical]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareV.previous[pVert.vertical][month]=1
                                    labChartData.verticalData[pVert.vertical]=1
                                }
                            }else{
                                if(labReportData.monthlyCompareO.previous[pVert.value]){
                                    labReportData.monthlyCompareO.previous[pVert.value][month]++
                                    labChartData.verticalDataOther[pVert.value]++
                                }else{
                                    labReportData.monthlyCompareO.previous[pVert.value]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareO.previous[pVert.value][month]=1
                                    labChartData.verticalDataOther[pVert.value]=1
                                } 
                            }
                        }else{
                            if(!others.includes(pVert.value)){
                                labReportData.monthlyCompareT.outbound.previous[month]++;
                                if(labReportData.monthlyCompareV.outbound.previous[pVert.vertical]){
                                    labReportData.monthlyCompareV.outbound.previous[pVert.vertical][month]++
                                    labChartData.verticalData[pVert.vertical]++
                                }else{
                                    labReportData.monthlyCompareV.outbound.previous[pVert.vertical]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareV.outbound.previous[pVert.vertical][month]=1
                                    labChartData.verticalData[pVert.vertical]=1
                                }
                            }else{
                                if(labReportData.monthlyCompareO.previous[pVert.value]){
                                    labReportData.monthlyCompareO.previous[pVert.value][month]++
                                    labChartData.verticalDataOther[pVert.value]++
                                }else{
                                    labReportData.monthlyCompareO.previous[pVert.value]=[0,0,0,0,0,0,0,0,0,0,0,0]
                                    labReportData.monthlyCompareO.previous[pVert.value][month]=1
                                    labChartData.verticalDataOther[pVert.value]=1
                                } 
                            }
                        }
                    }
                }
                const custVisits = await CustomerVisit.find({date:{$gte:req.query.start, $lte:req.query.end}}).exec()
                let highest=0, lowest=5, top=[];
                for(let cVisit of custVisits){
                    for(let usecase of cVisit.usecase){
                        labChartData.usecases[usecase] ? 
                            labChartData.usecases[usecase]++ :
                            labChartData.usecases[usecase]=1
                    }
                    if(cVisit.star>=highest){
                        highest=cVisit.star
                        top.push(cVisit)
                    }
                    if(cVisit.star<lowest){
                        lowest=cVisit.star
                        labReportData.ratings.lowest = cVisit
                    }
                }
                for(let i=0;i<top.length;i++){
                    if(top[i].star!=highest){
                        delete top[i]
                    }
                }
                top = top.filter((ele)=>{return ele != null})
                top.sort((a,b)=>{return a.enhancement.length - b.enhancement.length})
                labReportData.ratings.highest = top.length>3 ? top.slice(-3) : top;
                

                const usecaseNames = []
                const usecaseValues = []
                for(name in labChartData.usecases){
                    usecaseNames.push(name)
                    usecaseValues.push(labChartData.usecases[name])
                }
                labChartData.usecases={
                    names:usecaseNames,
                    values:usecaseValues
                }

                const locations =[], locationsO=[];
                const numberOfVisits=[], numberOfVisitsO=[];
                const monthlyVisits = [], monthlyVisitsO = [];
                for(loc in labReportData.visitsData.lab){
                    locations.push(loc);
                    numberOfVisits.push(labReportData.visitsData.lab[loc].total)
                    monthlyVisits.push(labReportData.visitsData.lab[loc].monthly)
                }
                for(loc in labReportData.visitsDataO.lab){
                    locationsO.push(loc);
                    numberOfVisitsO.push(labReportData.visitsDataO.lab[loc].total)
                    monthlyVisitsO.push(labReportData.visitsDataO.lab[loc].monthly)
                }
                labReportData.visitsData = {
                    locations:locations,
                    visits:numberOfVisits,
                    drilldown:monthlyVisits
                }
                labReportData.visitsDataO ={
                    locations:locationsO,
                    visits:numberOfVisitsO,
                    drilldown:monthlyVisitsO
                }

                const monthlyDataC = {};
                for(vert in labReportData.monthlyCompareV.current){
                    monthlyDataC[vert] = labReportData.monthlyCompareV.current[vert]
                }
                labReportData.monthlyCompareV.current = monthlyDataC

                const monthlyDataP = {};
                for(vert in labReportData.monthlyCompareV.previous){
                    monthlyDataP[vert] = labReportData.monthlyCompareV.previous[vert]
                }
                labReportData.monthlyCompareV.previous = monthlyDataP

                const monthlyDataOC = {};
                for(vert in labReportData.monthlyCompareO.current){
                    monthlyDataOC[vert] = labReportData.monthlyCompareO.current[vert]
                }
                labReportData.monthlyCompareO.current = monthlyDataOC
                
                const monthlyDataOP = {}
                for(vert in labReportData.monthlyCompareO.previous){
                    monthlyDataOP[vert] = labReportData.monthlyCompareO.previous[vert]
                }
                labReportData.monthlyCompareO.previous = monthlyDataOP
                
                res.json({status:true, charts:labChartData, report:labReportData})

            }catch (e){
                console.log("Error:",e)
                res.json({status:false, message:e})
            }
        },

        //function that takes all the client sent data from the html page and turns it into a PDF
        // which is stored on the server side
        generateReport: async function(req,res){

            try{
                const browser = await puppeteer.launch()
                const page = await browser.newPage()

                const title = ""+Date.now()+'.pdf'
                await page.setContent(""+JSON.parse(req.body.page))
                await page.emulateMedia('screen')
                await page.pdf({
                    path: title,
                    height:"2300px",
                    printBackground:true,
                })
               
                res.json({status:true,message:"Works",title:title})

            }catch(e){
                console.log(e)
                res.json({status:false,message:e})
            }
            
        },

        //function that allows the client to get the generated PDF and then deletes the PDF from the server
        fetchReport: function(req,res){
            fs.readFile('./'+req.body.title, (err, data) => {
                if (err){
                    console.log("There was an error",err)
                    res.status(500).send(err);
                }else{
                    fs.unlink('./'+req.body.title)
                    res.contentType('application/pdf')
                    .send(`data:application/pdf;base64,${new Buffer.from(data).toString('base64')}`);
                }  
            });
        }
    }
})()
