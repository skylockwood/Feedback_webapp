app.controller('sessionController', function($scope, $location, sessionFactory){
    $scope.currentUser = {status:false}
    $scope.users = {}

    $scope.$on('$routeChangeError', function() {
        $location.url('/403:forbidden')
      });

    sessionFactory.getSession(function(data){
        $scope.currentUser = data;
        if(!$scope.currentUser.status){
            $location.url('/')
        }        
    })
    $scope.createUser = function(){
        sessionFactory.create({user:$scope.newUser.name, password:$scope.newUser.password, level:$scope.newUser.level})
    }

    $scope.index = function(){
        document.getElementById('index').style.visibility = 'visible'
        sessionFactory.index(function(data){
            $scope.users = data
        })
    }

    $scope.update = function(){
        sessionFactory.update({user:$scope.currentUser.user})
    }
    $scope.delete = function(id){
        sessionFactory.delete({_id:id})
    }

    $scope.login = function(){
        sessionFactory.login($scope.credentials)
    }
})