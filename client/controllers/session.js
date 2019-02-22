app.controller('sessionController', function($scope, $location, sessionFactory){
    $scope.currentUser = {status:false}

    $scope.$on('$routeChangeError', function() {
        $location.url('/403:forbidden')
      });

    sessionFactory.getSession(function(data){
        console.log(data)
        $scope.currentUser = data;
        if(!$scope.currentUser.status){
            $location.url('/')
        }        
    })
    $scope.update = function(){
        sessionFactory.update({user:$scope.currentUser.user})
    }

    $scope.login = function(){
        sessionFactory.login($scope.credentials)
    }
})