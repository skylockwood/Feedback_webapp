//This is the main Angular app. It handles the processing of all the routes.
var app = angular.module('feedbackApp',['ngRoute','zingchart-angularjs']);

app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'partials/login.html'
    })
    .when('/dashboard',{
        templateUrl:'partials/dashboard.html',
        resolve:{
            function($http,$q){
                var deferred = $q.defer()
                return $http.get('/getSession').then(
                    function(output){
                        output.data.status ? deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                        return deferred.promise
                    },
                );
            }
        }
    })
    .when('/admin',{
        templateUrl:'partials/admin.html',
        resolve:{
            function($http,$q){
                var deferred = $q.defer()
                return $http.get('/getSession').then(
                    function(output){
                        output.data.level==9 ? 
                        deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                        return deferred.promise
                    },
                );
            }
        }
    })
    .when('/customer_feedback',{
        templateUrl:'partials/customer_feedback.html',
        resolve:{
            function($http,$q){
                var deferred = $q.defer()
                return $http.get('/getSession').then(function(output){
                    output.data.level>1 ? deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                    return deferred.promise
                });
            }
        }
    })
    .when('/lab_feedback',{
        templateUrl:'partials/lab_feedback.html',
        resolve:{
            function($http,$q){
                var deferred = $q.defer()
                return $http.get('/getSession').then(function(output){
                    output.data.level>1 ? deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                    return deferred.promise
                });
            }
        }
    })
    .when('/feedback',{
        templateUrl:'partials/feedback.html',
        function($http,$q){
            var deferred = $q.defer()
            return $http.get('/getSession').then(function(output){
                output.data.status ? deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                return deferred.promise
            })
        }
    })
    .when('/excalibur',{
        templateUrl:'partials/excalibur.html',
        function($http,$q){
            var deferred = $q.defer()
            return $http.get('/getSession').then(function(output){
                output.data.status ? deferred.resolve("Success: Logged in") : deferred.reject("Failed: No session")
                return deferred.promise
            })
        }
    })
    .when('/403:forbidden',{
        templateUrl:'partials/403.html'
    })
    .when('/404:page_not_found',{
        templateUrl:'partials/404.html'
    })
    .otherwise({
        templateUrl:'partials/404.html'
    })
})

   
