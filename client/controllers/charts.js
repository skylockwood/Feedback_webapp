//Responsible for client side communication with HTML and chart server side functionality
app.controller('chartsController',function($scope,$location,chartsFactory){
    $scope.range = [2018,2019]
    $scope.initState=null

    //Changes series data on a chart when node is clicked
    zingchart.node_click = function(p) {
        if ($scope.visitsDrilldown[p['data-id']]){
            zingchart.exec('visitsChart', 'setseriesdata',{
                data: $scope.visitsDrilldown[p['data-id']].series
            });
        }
    }
    
    //Changes chart when chart shape is clicked
    zingchart.shape_click = function(p) {
        var shapeId = p.shapeid;
        switch(shapeId) {
            case 'forwards':
            case 'backwards':
            case 'default':
                zingchart.exec('visitsChart', 'destroy');
                zingchart.render({
                    id : 'visitsChart', 
                    data : $scope.visitsChart, 
                    height: '100%', 
                    width: '100%' 
                });
                break;
        }
    }

    //JSON for chart that shows all verticals data. 
    //This chart can be found at '/dashboard'. This chart is not in the report
    $scope.verticalsChart={
        "type": "ring",
        "title": {
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "tooltip":{
            "text":"%t",
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true
        },
        "plot": {
            "value-box" : {
                "placement" : "in",
                "text" : "%pv\n"+ "%npv%"
             }
        },
        "series": []
    };

    //JSON for chart that shows visit data for the main verticals. 
    //This chart can be found at '/dashboard'
    $scope.visitsChart ={
        "type": "ring",
        "title": {
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true
        },
        "plot": {
            "value-box" :{
                "placement":"in",
                "text" : "%pv\n"+"%npv%",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },           
        },
        "series": [],
        "shapes":[
            {
             'x':25,
             'y':20,
             'size':10,
             'angle':-90,
             'type':'triangle',
             'background-color':'#C4C4C4',
             'padding':5,
             'cursor':'hand',
             'id': 'backwards',
             'hover-state': {
               'border-width': 1,
               'border-color': '#000'
             }
           }
         ]
    };

    //JSON for chart that shows visit data for the other verticals. 
    //This chart can be found at '/dashboard'
    $scope.visitsOtherChart ={
        "type": "ring",
        "title": {
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true
        },
        "plot": {
            "value-box" :{
                "placement":"in",
                "text" : "%pv\n"+"%npv%",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },           
        },
        "series": [],
        "shapes":[
            {
             'x':25,
             'y':20,
             'size':10,
             'angle':-90,
             'type':'triangle',
             'background-color':'#C4C4C4',
             'padding':5,
             'cursor':'hand',
             'id': 'backwards',
             'hover-state': {
               'border-width': 1,
               'border-color': '#000'
             }
           }
         ]
    };

    //JSON for chart that shows the total verticals on a month to month basis. Comparing to previous year. 
    //This chart can be found at '/dashboard'
    $scope.monthlyCompareTotal = {
        "type" : 'bar',
        "plot":{
            "value-box" :{
                "placement":"middle",
                "text" : "%v",
                "color":"white",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },
        },
        "tooltip":{
            "text":"%t",
        },
        "title":{
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "subtitle":{
            "adjust-layout":true
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true,
            "rules": [
                {
                  "rule": '%v == 0',
                  "visible": 0
                }
            ],
        },
        "scaleX":{
            "values":["18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","19 \xa0 20","19 \xa0 20","19 \xa0 20"],
            "item": {
                "offsetY": -5,
              },
              "tick": {
                "size": 10
              }
        },
        "scale-x-2": {
            "values":["April","May","June","July","Aug","Sept","Oct","Nov","Dec","Jan","Feb","March"],
            "placement": "default",
            "tick": {
            "size": 58,
            "placement": "cross"
            },
            "itemsOverlap": true,
            "item": {
            "offsetY": -55
            }
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    };

    //JSON for chart that shows the main verticals on a month to month basis. Comparing to previous year. 
    //This chart can be found at '/dashboard'
    $scope.monthlyVerticalsChart = {
        "type" : 'bar',
        "plot":{
            "stacked":true,
            "stack-type":"normal",
            "value-box" :{
                "placement":"middle",
                "text" : "%v",
                "color":"white",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },
        },
        "tooltip":{
            "text":"%t",
        },
        "title":{
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "subtitle":{
            "adjust-layout":true
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true,
            "rules": [
                {
                  "rule": '%v == 0',
                  "visible": 0
                }
            ],
        },
        "scaleX":{
            "values":["18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","19 \xa0 20","19 \xa0 20","19 \xa0 20"],
            "item": {
                "offsetY": -5,
              },
              "tick": {
                "size": 10
              }
        },
        "scale-x-2": {
            "values":["April","May","June","July","Aug","Sept","Oct","Nov","Dec","Jan","Feb","March"],
            "placement": "default",
            "tick": {
            "size": 58,
            "placement": "cross"
            },
            "itemsOverlap": true,
            "item": {
            "offsetY": -55
            }
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    };

    //JSON for chart that shows the other verticals on a month to month basis. Comparing to previous year. 
    //This chart can be found at '/dashboard'
    $scope.monthlyOtherVerticalsChart = {
        "type" : 'bar',
        "plot":{
            "stacked":true,
            "stack-type":"normal",
            "value-box" :{
                "placement":"middle",
                "text" : "%v",
                "color":"white",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },
        },
        "tooltip":{
            "text":"%t",
        },
        "title":{
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "subtitle":{
            "adjust-layout":true
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true,
            "rules": [
                {
                  "rule": '%v == 0',
                  "visible": 0
                }
            ],
        },
        "scaleX":{
            "values":["18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","18 \xa0 19","19 \xa0 20","19 \xa0 20","19 \xa0 20"],
            "item": {
                "offsetY": -5,
              },
              "tick": {
                "size": 10
              }
        },
        "scale-x-2": {
            "values":["April","May","June","July","Aug","Sept","Oct","Nov","Dec","Jan","Feb","March"],
            "placement": "default",
            "tick": {
            "size": 58,
            "placement": "cross"
            },
            "itemsOverlap": true,
            "item": {
            "offsetY": -55
            }
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    };

    //JSON for chart that shows the usecases on a yearly basis. 
    //This chart can be found at '/dashboard'. This chart is not in the report
    $scope.customerUsecases = {
        "type" : 'bar',
        "plot":{
            "value-box" :{
                "placement":"middle",
                "text" : "%v",
                "color":"white",
                "rules": [
                    {
                      "rule": '%v == 0',
                      "visible": 0
                    }
                ],
            },
        },
        "title":{
            "backgroundColor" : "transparent",
            "fontColor" :"black",
            "text" : "",
            "adjust-layout":true
        },
        "tooltip":{
            "text":"%t",
        },
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true,
            "draggable":true,
            "layout":"x1",
            "max-items":4,
            "overflow":"page",
            "width": "250px",
            "height":"150px",
            "item":{
                "width":"200px",
                "wrapText":true
            }
            
        },
        "scaleX": {
            "label":{
                "text":"Usecases",
            },
            "labels":["Year so far"]
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    }
    
    //Function that gathers the chart information on the '/dashboard' and sends it server side to be turned into a PDF
    $scope.genReport = function(){
        let doc = angular.element(document.getElementById("reportActual"))
        chartsFactory.genReport({page:JSON.stringify(doc[0].outerHTML)})
    }

    //Function that calls the server to supply chart series data and then enters it into the Chart JSON for display
    //gets data for maximum 1 year starting from beginning of selected month
    $scope.getCharts = function(){
        $scope.monthlyCompareTotal.series=[]
        $scope.monthlyVerticalsChart.series=[];
        $scope.verticalsChart.series=[];
        $scope.visitsChart.series=[];
        $scope.visitsOtherChart.series=[];
        $scope.monthlyOtherVerticalsChart.series=[];
        $scope.visitsDrilldown=[];
        $scope.customerUsecases.series = []

        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let date1 = new Date();
        date1.setUTCFullYear($scope.year,3,1);
        date1.setUTCHours(0,0,0,0);

        let date2 =new Date(date1.getTime());
        date2 = date2+31536000000<Date.now() ? date2.setUTCFullYear($scope.year+1) : new Date(Date.now());
        date2.setUTCMonth(date2.getUTCMonth(),1)
        date2.setUTCHours(0,0,0,0);

        let date0 = new Date(date1.getTime());
        date0.setUTCFullYear($scope.year-1)
        const year ={
            previous:date0,
            start:date1,
            end: date2
        }

        document.getElementById('chartsDiv').style.visibility = "visible";
        chartsFactory.getCharts(year,function(data){
            console.log(data)
            const verticals = data.charts.verticalData;
            $scope.verticalsChart.title.text = "Main Verticals for "+$scope.year;
            let vertcount = 0
            for(i in verticals){
                $scope.verticalsChart.series[vertcount]={"values":[verticals[i]],"text":i}
                vertcount++;
            }
            
            const visits = data.report.visitsData.visits;
            const locations = data.report.visitsData.locations;
            $scope.visitsChart.title.text = "Main Vertical Locations for "+$scope.year;
            for(let i=0;i<visits.length;i++){
                $scope.visitsChart.series[i]={"values":[visits[i]],"text":[locations[i]],"data-id":locations[i]}
                for(let j=0;j<data.report.visitsData.drilldown[i].length;j++){
                    if($scope.visitsDrilldown[locations[i]]){
                        $scope.visitsDrilldown[locations[i]].series.push({"values":[data.report.visitsData.drilldown[i][j]], "text":MONTHS[j]})
                    }else{
                        $scope.visitsDrilldown[locations[i]]={series:[{"values":[data.report.visitsData.drilldown[i][j]], "text":MONTHS[j]}]}
                    }
                }
            }

            const visitsOther = data.report.visitsDataO.visits;
            const locationsOther = data.report.visitsData.locations;
            $scope.visitsOtherChart.title.text = "Other Vertical Locations for "+$scope.year;
            for(let i=0;i<visitsOther.length;i++){
                $scope.visitsOtherChart.series[i]={"values":[visitsOther[i]],"text":[locationsOther[i]]}
            }

            const totalsC = data.report.monthlyCompareT.current;
            const totalsP = data.report.monthlyCompareT.previous;
            $scope.monthlyCompareTotal.title.text = "Total Main Verticals for "+($scope.year-1)+"/"+$scope.year
            const tSeries=[], tPrev=totalsP.reduce((a,b)=>a+b),tCurr=totalsC.reduce((a,b)=>a+b);
            tSeries.push({"values":totalsP,"text":""+($scope.year-1),"stack":2})
            tSeries.push({"values":totalsC,"text":""+$scope.year,"stack":1})
            $scope.monthlyCompareTotal.subtitle.text = "Visits in "+($scope.year-1)+": "+tPrev+"\nvisits in "+$scope.year+": "+tCurr

            const monthlyVC = data.report.monthlyCompareV.current
            const monthlyVP = data.report.monthlyCompareV.previous
            const monthlyV = ['Manufacturing','Energy and Utilities','Life Sciences and Healthcare','Travel and Transport Logistics','RCPG','Other']
            $scope.monthlyVerticalsChart.title.text = "Main Verticals by Month Comparison for "+($scope.year-1)+"/"+$scope.year 
            let palette=0;
            const vSeries=[];
            let vPrev=0, vCurr=0
            for(let name of monthlyV){
                vSeries.push({"values":monthlyVP[name],"text": name,"legendItem":{"visible":false},"stack":2, "palette":palette, "alpha":0.7})
                vSeries.push({"values":monthlyVC[name],"text":name,"stack":1, "palette":palette})
                vPrev+=monthlyVP[name] ? monthlyVP[name].reduce((a,b)=>a+b) : 0;
                vCurr+=monthlyVC[name] ? monthlyVC[name].reduce((a,b)=>a+b) : 0;
                palette++;
            }
            $scope.monthlyVerticalsChart.subtitle.text = "Visits in "+($scope.year-1)+": "+vPrev+"\nvisits in "+$scope.year+": "+vCurr


            const monthlyOC = data.report.monthlyCompareO.current
            const monthlyOP = data.report.monthlyCompareO.previous
            const monthlyO = ["Analyst","Internal","Partners"]
            $scope.monthlyOtherVerticalsChart.title.text = "Other Verticals by Month Comparison for "+($scope.year-1)+"/"+$scope.year 
            palette=0;
            const oSeries=[];
            let oPrev = 0, oCurr = 0;
            for(let name of monthlyO){
                oSeries.push({"values":monthlyOP[name],"text":name,"legendItem":{"visible":false},"stack":2, "palette":palette, "alpha":0.7})
                oSeries.push({"values":monthlyOC[name],"text":name,"stack":1, "palette":palette})
                oPrev+=monthlyOP[name] ? monthlyOP[name].reduce((a,b)=>a+b) : 0;
                oCurr+=monthlyOC[name] ? monthlyOC[name].reduce((a,b)=>a+b) : 0;
                palette++;
            }
            $scope.monthlyOtherVerticalsChart.subtitle.text = "Visits in "+($scope.year-1)+": "+oPrev+"\nvisits in "+$scope.year+": "+oCurr


            //document.getElementById('ratings').innerHTML = '<div><p>'+data.report.ratings.highest[0]+'</p><br><p>'+data.report.ratings.lowest+'</p></div>'

            $scope.monthlyVerticalsChart.series = vSeries
            $scope.monthlyOtherVerticalsChart.series = oSeries
            $scope.monthlyCompareTotal.series = tSeries
            
            var uc_names = data.charts.usecases.names;
            var uc_values = data.charts.usecases.values;
            $scope.customerUsecases.title.text = "Usecases: Customer Interest "+$scope.year
            for(var i=0;i<uc_names.length;i++){
                $scope.customerUsecases.series[i]={"values":[uc_values[i]],"text":uc_names[i]}
                $scope.customerUsecases.scaleX.labels.push(i.toString());
            }
            
        })
    };
})
