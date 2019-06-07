//Responsible for client side communication with HTML and customer visit server side functionality
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
        years: [2018,2019]
    }
    $scope.path = ""
    
    //Function that returns all the customer visit data after querying the server
    $scope.getVisits = function(){
        $scope.search.lab = $scope.currentUser.user
        customerVisitsFactory.getVisits($scope.search, function(data){
            $scope.visits = data;
        })
    }

    //Function that creates a CSV file of the customer data
    const ObjectToCSV = function(data){
        const csvRows =[]
        const headers = Object.keys(data[0])
        for(const row of data){
            const values = headers.map(header=>{
                const escaped = (''+row[header]).replace(/"/g,'\\"')
                return `"${escaped}"`
            })
            csvRows.push(values.join(','))
        }
        return csvRows.join('\n');

    }
    
    //Function that allows the Client to download the CSV file
    const download = function(data){
        const blob = new Blob([data],{ type: 'text/csv'});
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('hidden','')
        a.setAttribute('href', url)
        a.setAttribute('download', 'CustomerFeedback'+'.csv')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }


    //Function that gathers the customer feedback and organizes it into rows,
    //prepping it for conversion to CSV file
    $scope.getFeedback = function(){
        var date = new Date()
        date.setUTCFullYear($scope.date.year,$scope.date.month.value,1);
        date.setUTCHours(0,0,0,0);
        var end = new Date(Date.now())
        document.getElementById('feedback').style.visibility = 'visible'
        customerVisitsFactory.getFeedback({start:date,end:end},function(data){
            var json = data.visits
            const csv = json.map(row=>({
                startTime:'#',
                completionTime: row.date,
                Email:'anonymous',
                name:"",
                name2:row.name,
                company: row.company,
                designation: row.designation,
                email: row.email,
                objective: row.objective,
                usecase: row.usecase,
                enhancement: row.enhancement,
                recommendations: row.recommendations,
                star: row.star
            }))
            const csvfile = ObjectToCSV(csv);
            download(csvfile)
            data.visits.shift()
            $scope.fb = data.visits
            var total=0
            var customerCount=0
            for(var i=0;i<$scope.fb.length;i++){
                total+=$scope.fb[i].star
                if($scope.fb[i].star!=0){
                    customerCount++;
                }
            }
            $scope.avg = Math.round((total/customerCount)*100)/100          
        })

    }
    //function that finds a visit within a time range
    $scope.findVisit = function(){
        var end = new Date($scope.visit.date.getTime() + 86400000)
        customerVisitsFactory.findVisit({date:$scope.visit.date,end:end}, function(data){
            $scope.dailyVisits = data
        })
    }

    //function that creates a new customer visit by taking the data that the customer filled out
    // on the customer feedback form
    $scope.create = function(user){
        $scope.visit.location = user;
        $scope.visit.date = new Date();
        customerVisitsFactory.createCustomerVisit($scope.visit)
        $scope.visit = {};
    }

    //function that creates multiple customer visits based on a correctly formatted excel file
    // see the README for more information on formatting the excel file
    $scope.createFromFile = function(){
        if($scope.path.length>1){
            customerVisitsFactory.createVisitsFromFile($scope.path)
        }else{
            alert("Please select a location first")
        }
    }

    //function that deletes all the stored customer data.
    //it is best practice to export all current customer data before envoking this method
    $scope.purge = function(){
        if(confirm("Press 'OK' to confirm that you want to Purge all Customer data")){
            customerVisitsFactory.purgeCustomerVisits(function(data){
                alert(data);
            })
        }
        
    }

})
