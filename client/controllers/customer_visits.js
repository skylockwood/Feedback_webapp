app.controller('customerVisitsController', function($scope,$location,customerVisitsFactory){
    $scope.visits = []
    $scope.fb = []
    $scope.dailyVisits = []
    $scope.date ={
        months:[
            {name:"January", value:0},{name:"February", value:1},{name:"March", value:2},
            {name:"April", value:3},{name:"May", value:4},{name:"June", value:5},
            {name:"July", value:6},{name:"August", value:7},{name:"September", value:8},
            {name:"October", value:9},{name:"November",value:10},{name:"December",value:11}],
        years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]
    }
    $scope.path = {path:'C:/Users/sky.lockwood/Desktop/CustomerFeedback/client/customervisits2019.xlsx'};
    
    $scope.getVisits = function(){
        $scope.search.lab = $scope.currentUser.user
        customerVisitsFactory.getVisits($scope.search, function(data){
            $scope.visits = data;
        })
    }
    $scope.getFeedback = function(){
        console.log($scope.date)
        var date = new Date()
        date.setFullYear($scope.date.year,$scope.date.month.value,1);
        date.setHours(0,0,0,0);
        var end = new Date(date.getTime());
        end.setMonth($scope.date.month.value+1)
        document.getElementById('feedback').style.visibility = 'visible'
        console.log(date,'\n',end)
        customerVisitsFactory.getFeedback({start:date,end:end},function(data){
            $scope.fb = data
            var total=0
            for(var i=0;i<$scope.fb.length;i++){
                total+=$scope.fb[i].star
            }
            $scope.avg = Math.round((total/data.length)*100)/100
        })
    }
    $scope.findVisit = function(){
        var end = new Date($scope.visit.date.getTime() + 86400000)
        customerVisitsFactory.findVisit({date:$scope.visit.date,end:end}, function(data){
            $scope.dailyVisits = data
        })
    }
    $scope.create = function(user){
        $scope.visit.location = user;
        $scope.visit.date = new Date();
        customerVisitsFactory.createCustomerVisit($scope.visit)
        $scope.visit = {};
    }
    $scope.createFromFile = function(){
        customerVisitsFactory.createVisitsFromFile($scope.path)
    }
    $scope.purge = function(){
        customerVisitsFactory.purgeCustomerVisits(function(data){
            alert(data);
        })
    }

})