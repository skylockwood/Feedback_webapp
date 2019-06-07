app.factory('chartsFactory',function($http,$location){
    var factory ={}

    //function that takes data from the client controller function with the same name and preps it to
    // be sent to the server
    factory.getCharts = function(year, callback){
        $http.get('/charts/get',{params:year}).then(function(output){
            output.data.status ? callback(output.data) : alert("Query failed:", output.data.err);
        })
    }

    //function that takes data from the client controller function with the same name and preps it to
    // be sent to the server.
    //Gets the charts in PDF form and allows the client to download
    factory.genReport = function(page){
        $http.post('/charts/report',page).then(function(output){
            $http.post('/charts/fetch',{title:output.data.title})
            .then(res => res.data)
            .then(base64String => {
            const anchorTag = document.createElement('a');
            anchorTag.href = base64String;
            anchorTag.download = ""+Date.now()+".pdf"; 
            anchorTag.click();
            })
        })
    }
    
    return factory;
})