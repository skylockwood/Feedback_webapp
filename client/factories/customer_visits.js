//All functions here take data from the client side controller and prep to be sent to 
// the server for processing
app.factory('customerVisitsFactory', function($http, $location){
    var factory ={}

    factory.getVisits = function(search, callback){
        $http.get('/visits/get_range',{params:search}).then(function(output){
            if(output.data.status==true){
                callback(output.data.visits);
            }else{
                alert("Query failed: "+output.data.error)
            }
        })
    }
    factory.getFeedback = function(search, callback){
        $http.get('/visits/get_feedback',{params:search}).then(function(output){
            if(output.data.status==true){
                callback(output.data)
            }else{
                alert("Query failed: "+output.data.error)
            }
        })
    }

    factory.findVisit = function(date,callback){
        $http.get('/visits/get_visit',{params:date}).then(function(output){
            if(output.data.status==true){
                callback(output.data.visits)
            }else{
                alert("No customer visits found for that date")
            }
        })
    }

    factory.createCustomerVisit = function(visit){
        $http.post('/visits/add', visit).then(function(output){
            if(output.data.status == true){
                alert("Successfully submitted. Thank you!")
                $location.url('/dashboard');
            }else{
                alert("Error with submission:",output.data.error)
            }
        })
    }

    factory.createVisitsFromFile = function(file){
        $http.post('/visits/addFile', {path:file}).then(function(output){
            if(output.data.status == true){
                alert("File read and task completed")
            }else{
                alert("Task failed")
            }
        })
    }

    factory.purgeCustomerVisits = function(callback){
        $http.delete('/visits/purge').then(function(output){
            if(output.data.status == true){
                callback(output.data.message)
            }else{
                alert('Error purging:',output.data.error)
            }
        })
    }
    return factory;
})
