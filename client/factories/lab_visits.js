//All functions here take data from the client side controller and prep to be sent to 
// the server for processing
app.factory('labFactory',function($http,$location){
    var factory = {}

    factory.getVisits = function(search, callback){
        $http.get('/lab/get_range',{params:search}).then(function(output){
            if(output.data.status==true){
                callback(output.data)
            }else{
                alert("Query failed: "+output.data.error)
            }
        })
    }
    factory.createLabVisit = function(visit){
        $http.post('/lab/add',visit).then(function(output){
            if(output.data.status == true){
                alert("Successfully submitted. Thank you!")
                $location.url('/dashboard');
            }else{
                alert("Error with submission")
            }
        })
    }
    factory.createVisitsFromFile = function(file){
        $http.post('/lab/addFile', {path:file}).then(function(output){
            if(output.data.status == true){
                alert("File read and task completed")
            }else{
                alert("Task failed",output.data)
            }
        })
    }
    factory.updateVisit = function(update, callback){
        $http.post('/lab/update_visit',update).then(function(output){
            if(output.data.status == true){
                callback(output.data.message)
            }else{
                alert(output.data)
            }
        })
    }
    factory.deleteVisit = function(id, callback){
        $http.delete('/lab/delete',{params:{_id:id}}).then(function(output){
            output.data.status==true ? callback(output.data.message) : alert("Error deleting lab visit")
        })
    }

    factory.purgeLabVisits = function(callback){
        $http.delete('/lab/purge').then(function(output){
            if(output.data.status == true){
                callback(output.data.message)
            }else{
                alert('Error purging:',output.data.error)
            }
        })
    }
    return factory;
})
