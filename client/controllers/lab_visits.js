app.controller('labController', function($scope,$location,labFactory){
    $scope.visits = [];
    $scope.count = [];
    $scope.date ={
        months:[
            {name:"January", value:0},{name:"February", value:1},{name:"March", value:2},
            {name:"April", value:3},{name:"May", value:4},{name:"June", value:5},
            {name:"July", value:6},{name:"August", value:7},{name:"September", value:8},
            {name:"October", value:9},{name:"November",value:10},{name:"December",value:11}],
        years: [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]
    }
    $scope.path = {path:'C:/Users/sky.lockwood/Desktop/CustomerFeedback/client/labvisits2019.xlsx'};

    $scope.getVisits = function(){
        document.getElementById('update').style.visibility = 'visible'
        var date = new Date()
        date.setFullYear($scope.date.year,$scope.date.month.value,1);
        date.setHours(0,0,0,0);
        var end = new Date(date.getTime());
        end.setMonth($scope.date.month.value+1)
        labFactory.getVisits({start:date,end:end}, function(data){
            $scope.visits = data.visits;
            $scope.count = data.count;
        })
    }
    $scope.create = function(user){
        $scope.visit.location = user;
        labFactory.createLabVisit($scope.visit)
        $scope.visit = {};
    }
    $scope.createFromFile = function(){
        labFactory.createVisitsFromFile($scope.path)
    }
    $scope.updateVisit = function(visit,excalibur,level){
        if(level>1){
            labFactory.updateVisit({_id:visit,excalibur:excalibur},function(data){
                document.getElementById('update').style.visibility = 'hidden'
                $scope.visits = [];
                alert(data);
            })
        }else{
            alert("Operation cannot be performed by Guest")
        }
    }
    $scope.deleteVisit = function(id,level){
        if(level==9){
            labFactory.deleteVisit({_id:id,},function(data){
                alert(data)
            })
        }else{
            alert("Operation cannot be performed by this user")
        }
    }

    $scope.purge = function(){
        labFactory.purgeLabVisits(function(data){
            alert(data);
        })
    }
})