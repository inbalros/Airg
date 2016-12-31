



var app = angular.module('myApp', []);


app.controller("projectCtrl",  function($scope, $http) {
    $http.get("https://cdn.contentful.com/spaces/5heisfxxrc2n/entries?access_token=2563614238ac1efeea0f969166808814e090c99a8ceb40f133159e00688d9d77&content_type=semester")
        .then(function (response) {
            $http.get("https://cdn.contentful.com/spaces/5heisfxxrc2n/entries?access_token=2563614238ac1efeea0f969166808814e090c99a8ceb40f133159e00688d9d77&content_type=courses")
                .then(function (response2) {
                    if (response2.data.items) {
                        //creating new object to hold the project all by the same year
                        var year = function (year,semester) {
                            this.year = year,
                                this.semester= semester;
                                this.courses = []
                        };

                        //create the array of all Courses by year
                        $scope.allCourses = {
                            years: []
                        };

                        //adding all the projects to the correct year
                        if (response.data.items) {
                            response.data.items.forEach(function (item, index) {
                                var item = item.fields;

                                var y = new year(item.year,item.semester);

                                //adding all the courses
                                if(item.courses) {
                                    item.courses.forEach(function (course, index) {
                                        var courseid = course.sys.id;
                                        //finding the correct course from the list by it id
                                        response2.data.items.forEach(function (cu, i) {
                                            if (courseid == cu.sys.id) {
                                                y.courses.push(cu.fields);
                                            }
                                        })
                                    })
                                }

                                $scope.allCourses.years.push(y);
                            })
                        }
                    }
                });
        });
});


app.controller("peopleCtrl",  function($scope, $http) {

    $http.get("https://cdn.contentful.com/spaces/5heisfxxrc2n/assets?access_token=2563614238ac1efeea0f969166808814e090c99a8ceb40f133159e00688d9d77")
        .then(function(response) {
            console.log(response.data.items);

            $scope.assets = response.data.items;
            $http.get("https://cdn.contentful.com/spaces/5heisfxxrc2n/entries?access_token=2563614238ac1efeea0f969166808814e090c99a8ceb40f133159e00688d9d77&content_type=people")
                .then(function(response) {
                    $scope.peoples=[];
                    response.data.items.forEach(function(item, index){
                        var imgSrcId=item.fields.img.sys.id;
                        var person=item.fields;
                        $scope.assets.forEach(function(it,i){
                            if (imgSrcId==it.sys.id){
                                person["img"]="http:"+it.fields.file.url;
                            }
                        })
                        $scope.peoples.push(person)
                    })

                });

        });
});

