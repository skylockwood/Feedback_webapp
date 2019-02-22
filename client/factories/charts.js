app.factory('chartsFactory',function($http,$location){
    var factory ={}

    factory.getCharts = function(year, callback){
        $http.get('/charts/get',{params:year}).then(function(output){
            output.data.status ? callback(output.data.charts) : alert("Query failed:", output.data.err);
        })
    }
    return factory;
})