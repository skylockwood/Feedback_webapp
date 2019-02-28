app.controller('chartsController',function($scope,$location,chartsFactory){
    $scope.range = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]
    $scope.initState=null

    zingchart.node_click = function(p) {
        if ($scope.visitsDrilldown[p['data-id']]){
            zingchart.exec('visitsChart', 'setseriesdata',{
                data: $scope.visitsDrilldown[p['data-id']].series
            });
        }
    }
 
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
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true
        },
        "scale-x": {
            "label":{
                "text":"Montly Verticals",
            },
            "labels":["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"]
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    };
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
        "plotarea":{"adjust-layout":true},
        "legend":{
            "adjust-layout":true,
            "draggable":true,
            "layout":"x1",
            "max-items":5,
            "overflow":"page",
            "width": "250px",
            "height":"150px",
            "item":{
                "width":"200px",
                "wrapText":true
            }
            
        },
        "scale-x": {
            "label":{
                "text":"Montly Verticals",
            },
            "labels":["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"]
        },
        "scale-y":{
            "label":{
                "text":"Amount"
            }
        },
        "series" : []
    };
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
        "scale-x": {
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

    $scope.getCharts = function(){
        $scope.monthlyVerticalsChart.series=[];
        $scope.verticalsChart.series=[];
        $scope.visitsChart.series=[];
        $scope.monthlyOtherVerticalsChart.series=[];
        $scope.visitsDrilldown=[];
        $scope.customerUsecases.series = []

        var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var date1 = new Date();
        date1.setFullYear($scope.year,0,1);
        date1.setHours(0,0,0,0);
        var date2 =new Date(date1.getTime());
        date2.setFullYear($scope.year+1)
        var year ={
            start:date1,
            end: date2
        }

        document.getElementById('chartsDiv').style.visibility = "visible";
        chartsFactory.getCharts(year,function(data){
            var verticals = data.verticalData;
            $scope.verticalsChart.title.text = "Verticals for "+$scope.year;
            var vertcount = 0
            for(i in verticals){
                $scope.verticalsChart.series[vertcount]={"values":[verticals[i]],"text":i}
                vertcount++;
            }
           
            var visits = data.visitsData.visits;
            var locations = data.visitsData.locations
            $scope.visitsChart.title.text = "Visits for "+$scope.year;
            for(var i=0;i<visits.length;i++){
                $scope.visitsChart.series[i]={"values":[visits[i]],"text":[locations[i]],"data-id":locations[i]}
                for(var j=0;j<data.visitsData.drilldown[i].length;j++){
                    if($scope.visitsDrilldown[locations[i]]){
                        $scope.visitsDrilldown[locations[i]].series.push({"values":[data.visitsData.drilldown[i][j]], "text":MONTHS[j]})
                    }else{
                        $scope.visitsDrilldown[locations[i]]={series:[{"values":[data.visitsData.drilldown[i][j]], "text":MONTHS[j]}]}
                    }
                }
            }

            var values = data.monthlyVerticalsData.values
            var names = data.monthlyVerticalsData.names
            $scope.monthlyVerticalsChart.title.text = "Verticals by Month "+$scope.year 
            for(var i=0;i<values.length;i++){
                $scope.monthlyVerticalsChart.series[i]={"values":values[i],"text":names[i]}
            }

            var otherValues = data.monthlyVerticalsDataOther.values
            var otherNames = data.monthlyVerticalsDataOther.names
            $scope.monthlyOtherVerticalsChart.title.text = "Other Verticals by Month "+$scope.year
            for(var i=0; i<otherValues.length;i++){
                $scope.monthlyOtherVerticalsChart.series[i]={"values":otherValues[i],"text":otherNames[i]}
            }

            var uc_names = data.usecases.names;
            var uc_values = data.usecases.values;
            $scope.customerUsecases.title.text = "Customer suggested usecases for "+$scope.year
            for(var i=0;i<uc_names.length;i++){
                $scope.customerUsecases.series[i]={"values":[uc_values[i]],"text":uc_names[i]}
                //$scope.customerUsecases.scale-x.labels.push(i.toString());
            }
        })
    };
})
