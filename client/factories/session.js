//All functions here take data from the client side controller and prep to be sent to 
// the server for processing
app.factory('sessionFactory', function($http, $location){
    var factory = {};

    factory.login = function(user){
        $http.post('/login', user).then(function(output){
            if(output.data.user.level == 9){
                $location.url('/admin');
            }else if(output.data.status==true){
                $location.url('/dashboard');
            }else if(output.data.status == false && output.data.error == false){
                alert("Login attempt failed: Incorrect username or password");
            }else if(output.data.status == false && output.data.error){
                alert("Login failed: "+output.data.error);
            }
        })
    },
    factory.create = function(user){
        $http.post('/create',user).then(function(output){
            if(output.data.status){
                alert(output.data.message)
            }else{
                alert(output.data.error)
            }
        })
    },
    factory.index = function(callback){
        $http.get('/user_index').then(function(output){
            output.data.status ? callback(output.data.users) : alert(output.data.error)
        })
    }
    factory.update = function(user){
        $http.post('/update',user).then(function(output){
            if(output.data.status){
                alert("successfully updated:",output.data.user)
            }else{
                alert("Failed to update user:",output.data.error)
            }
        })
    }
    factory.delete = function(id){
        $http.delete('delete_user',{params:id}).then(function(output){
            output.data.status ? alert("Successful deletion") : alert("Delete failed")
        })
    }
    factory.getSession = function(callback){
        $http.get('/getSession').then(function(output){
            callback(output.data);
        })
    }
    return factory;
})