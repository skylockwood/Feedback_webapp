//Responsible for client side communication with HTML and lab manager server side functionality
app.controller('labController', function($scope,$location,labFactory){
    $scope.visits = [];
    $scope.count = [];
    $scope.date ={
        months:[
            {name:"January", value:0},{name:"February", value:1},{name:"March", value:2},
            {name:"April", value:3},{name:"May", value:4},{name:"June", value:5},
            {name:"July", value:6},{name:"August", value:7},{name:"September", value:8},
            {name:"October", value:9},{name:"November",value:10},{name:"December",value:11}],
        years: [2018,2019]
    }
    $scope.path = "";

    //Function that creates a CSV file of the lab data
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
        a.setAttribute('download', 'LabManagerFeedback.csv')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    //Function that gathers the lab feedback and organizes it into rows,
    //prepping it for conversion to CSV file
    $scope.getVisits = function(){
        document.getElementById('update').style.visibility = 'visible'
        var date = new Date()
        date.setUTCFullYear($scope.date.year,$scope.date.month.value,1);
        date.setUTCHours(0,0,0,0);
        var end = new Date(Date.now());
        labFactory.getVisits({start:date,end:end}, function(data){
            var json = data.visits
            const csv = json.map(row=>({
                startTime:'#',
                completionTime:'#',
                email:'anonymous',
                name:"",
                customer: row.customer,
                date: row.date,
                arranged: row.arranged,
                location: row.where,
                vertical: row.vertical.map(i=>i.vertical=="Other"?i.value:i.vertical),
                who: row.who,
                usecase: row.usecase,
                interest: row.interest,
                next: row.next,
                excalibur: row.excalibur
            }))
            const csvfile = ObjectToCSV(csv);
            download(csvfile)

            $scope.visits = data.visits.slice(1);
            $scope.count = data.count;
        })
    }

    //function that creates a new customer visit by taking the data that the customer filled out
    // on the customer feedback form
    $scope.create = function(user){
        $scope.visit.location = user;
        labFactory.createLabVisit($scope.visit)
        $scope.visit = {};
    }

    //function that creates multiple customer visits based on a correctly formatted excel file
    // see the README for more information on formatting the excel file
    $scope.createFromFile = function(){
        if($scope.path.length>1){
            labFactory.createVisitsFromFile($scope.path)
        }else{
            alert("Please select a location first")
        }
        
    }

    //function that allows the Admin or a lab manager to update the ExcaliburID of a lab visit
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

    //function that allows the Admin delete a select visit
    $scope.deleteVisit = function(id){
        labFactory.deleteVisit(id,function(data){
            alert(data)
        })
    }

    //function that deletes all the stored customer data.
    //it is best practice to export all current customer data before envoking this method
    $scope.purge = function(){
        if(confirm("Press 'OK' to confirm that you want to Purge all Lab Manager data")){
            labFactory.purgeLabVisits(function(data){
                alert(data);
            })
        }
    }
})
