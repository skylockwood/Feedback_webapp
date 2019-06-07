var session = require('./../controllers/session.js')
var customer_visits = require('./../controllers/customer_visits.js')
var lab_visits = require('./../controllers/lab_visits.js')
var charts = require('./../controllers/charts.js')

//Client side factory data gets sent here and routed to the correct server side functionality
module.exports = function(app){
    app.post('/login',function(req,res){
        session.login(req,res);
    })
    app.get('/logout',function(req,res){
        session.logout(req,res);
    })
    app.get('/user_index',function(req,res){
        session.index(req,res);
    })
    app.post('/create',function(req,res){
        session.create(req,res)
    })
    app.post('/update',function(req,res){
        session.update(req,res)
    })
    app.delete('/delete_user',function(req,res){
        session.delete(req,res)
    })
    app.get('/getSession',function(req,res){
        session.getSession(req,res);
    })
    app.get('/visits/get',function(req,res){
        customer_visits.index(req,res);
    })
    app.get('/visits/get_feedback',function(req,res){
        customer_visits.feedback(req,res)
    })
    app.get('/visits/get_range',function(req,res){
        customer_visits.range(req,res);
    })
    app.get('/visits/get_visit',function(req,res){
        customer_visits.getVisits(req,res);
    })
    app.post('/visits/add',function(req,res){
        customer_visits.add(req,res);
    })
    app.post('/visits/addFile',function(req,res){
        customer_visits.addFromFile(req,res);
    })
    app.delete('/visits/purge',function(req,res){
        customer_visits.purge(req,res);
    })
    app.get('/lab/get_range',function(req,res){
        lab_visits.range(req,res);
    })
    app.post('/lab/add',function(req,res){
        lab_visits.add(req,res);
    })
    app.post('/lab/addFile',function(req,res){
        lab_visits.addFromFile(req,res);
    })
    app.post('/lab/update_visit',function(req,res){
        lab_visits.update(req,res);
    })
    app.delete('/lab/delete',function(req,res){
        lab_visits.delete(req,res);
    })
    app.delete('/lab/purge',function(req,res){
        lab_visits.purge(req,res);
    })
    app.get('/charts/get',function(req,res){
        charts.getLabCharts(req,res);
    })
    app.post('/charts/report',function(req,res){
        charts.generateReport(req,res);
    }),
    app.post('/charts/fetch',function(req,res){
        charts.fetchReport(req,res);
    })


}