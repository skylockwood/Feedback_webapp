var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var validator = require('node-mongoose-validator');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var excel = require('exceljs');
app.use(session({
    secret: 'fancysecret',
    resave: true,
    saveUninitialized: true,
    cookie:{secure:false}
}))

app.use(express.static(path.join(__dirname+'/client')))
app.use(express.static(path.join(__dirname+'/bower_components')))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app)

app.listen(4000);
console.log("listening on 4000")

/////////////////////////////////////////////////////////////////////////////////

/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";




app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');    
})

app.get('/charts',function(req,res){
    res.sendFile(__dirname+'/charts.html');
})

app.post('/postCharts',function(req,res){
    console.log(req.body)
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("visits").find({
            Timestamp:{
                $gte:new Date(req.body.startDate).getTime(),
                $lte:new Date(req.body.endDate).getTime()
            }
        }).toArray(function(err,result){
            if(err) throw err;
            //console.log(result);
            db.close();
            var relevance = {
                "Redmond":{},
                "Redmond-Outbound":{},
                "Noida":{},
                "Noida-Outbound":{}
            };
            for(ele in result){
                for(item in result[ele].Relevance){
                    if(relevance[result[ele].Relevance[item]]){
                        relevance[result[ele].Location][result[ele].Relevance[item]]++;
                    }
                    else{
                        relevance[result[ele].Location][result[ele].Relevance[item]] = 1;
                    }
                }
            }
            var locations = Object.keys(relevance);
            var values = {
                "Redmond":[],
                "Redmond-Outbound":[],
                "Noida":[],
                "Noida-Outbound":[]
            }

            var keys = ["LSH- Smart Clinical Trials (Remote Patient Monitoring - RPM)",
                        "LSH- Disease Management (RPM)","LSH- Drug Serialization",
                        "E&U -Active Grid Management (AGM)",
                        "Manufacturing - Overall Equipment Efficiency Analytics",
                        "Manufacturing - Predictive Maintenance",
                        "Manufacturing - Product Quality",
                        "Manufacturing - AR Field Services",
                        "Supply Chain - Asset Tracking (Indoor)",
                        "Supply Chain - Asset Tracking (Outdoor)",
                        "Supply Chain - Cold Chain Blockchain solution",
                        "Smart Worker Solution",
                        "Remote Device Management Platform - ReServ",
                        "IoT RUN","IoT Edge (Gateway, Instrumentation)",
                        "IoT Data Platform (Pangea, PAS)"];
            for(loc in locations){
                for(var i =0;i<keys.length;i++){
                    if(relevance[locations[loc]][keys[i]]){
                        values[locations[loc]].push(relevance[locations[loc]][keys[i]])
                    }else{
                        values[locations[loc]].push(0);
                    }
                    
                }
            }
            
            var data = {
                id: "myChart",
                    data: {
                    "type": "bar",
                    "title": {
                        "text": "Lab visits for "+req.body.startDate+" to "+req.body.endDate
                    },
                    "plot": {
                        "value-box": {
                        "text": "%v"
                        },
                        "tooltip": {
                        "text": "%v"
                        }
                    },
                    "legend": {
                        "toggle-action": "remove",
                        "header": {
                        "text": "Legend Header"
                        },
                        "item": {
                        "cursor": "pointer"
                        },
                        "draggable": true,
                        "drag-handler": "icon"
                    },
                    "scale-x": {
                        "values": keys
                    },
                    "series": [
                        {
                        "values": values[locations[0]],
                        "text": locations[0]
                        },
                        {
                        "values": values[locations[1]],
                        "text": locations[1]
                        },
                        {
                        "values": values[locations[2]],
                        "text": locations[2]
                        },
                        {
                        "values": values[locations[3]],
                        "text": locations[3]
                        }
                    ]
                }
            }
            res.send(data)
        })
    });
    
})

app.post('/process',function(req,res){
    //console.log(req.body);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var visit = {
            Timestamp:Date.now(),
            Name:req.body.name,
            Company:req.body.company,
            Designation:req.body.designation,
            Email:req.body.email,
            Objective:req.body.objective,
            Relevance:req.body.usecase,
            Experience:req.body.enhancement,
            Recommendations:req.body.recommendations,
            Rating:req.body.star,
            Location: "Redmond"
        };
        dbo.collection("visits").insertOne(visit, function(err,res){
            if(err) throw err;
            console.log("document inserted");
            db.close();
        });        
    });  
    res.redirect('/charts');  
});

app.post('/login',function(req,res){

})
*/