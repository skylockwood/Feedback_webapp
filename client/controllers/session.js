//Responsible for client side communication with HTML and user server side functionality
app.controller('sessionController', function($scope, $location, sessionFactory){
    $scope.currentUser = {status:false}
    $scope.users = {}

    //handles bad route requests
    $scope.$on('$routeChangeError', function() {
        $location.url('/403:forbidden')
      });

    //function that ensures that the web pages only display to users who are logged in
    sessionFactory.getSession(function(data){
        $scope.currentUser = data;
        if(!$scope.currentUser.status){
            $location.url('/')
        }        
    })

    //function that allows for creation of new user.
    //Only usable by user with Admin rights
    $scope.createUser = function(){
        sessionFactory.create({user:$scope.newUser.name, password:$scope.newUser.password, level:$scope.newUser.level})
    }

    //function that allows admin to view all users
    $scope.index = function(){
        document.getElementById('index').style.visibility = 'visible'
        sessionFactory.index(function(data){
            $scope.users = data
        })
    }

    //function used to promote a user to level 8 (Lab manager)
    $scope.update = function(){
        sessionFactory.update({user:$scope.currentUser.user})
    }

    //function to delete a user
    $scope.delete = function(id){
        sessionFactory.delete({_id:id})
    }

    //function to log in a user
    $scope.login = function(){
        sessionFactory.login($scope.credentials)
    }
})