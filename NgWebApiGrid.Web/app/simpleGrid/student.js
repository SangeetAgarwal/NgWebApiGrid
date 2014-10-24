angular.module('ngWebApiGrid.student', ['ngRoute'])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "studentCtrl",
        templateUrl: "app/simpleGrid/students.tpl.html"
    });

    $routeProvider.otherwise("/");
}])

.factory("dataService", ["$http", "$q", function ($http, $q) {

    var _students = [];

    var deferred = $q.defer();
    
    var _getStudents = function (options) {

        $http.get("api/StudentsApi")
            .then(function (result) {
                angular.copy(result.data.students, _students);
                deferred.resolve();
            },
            function () {
                deferred.reject();
            });

        return deferred.promise;
    };

    return {
        students:_students,
        getStudents: _getStudents,
    };
}])
.controller("studentCtrl", ["$scope", "dataService",
    function ($scope, dataService) {
        $scope.data = dataService.students;

        var options = {            
            
        };

        dataService.getStudents(options)
        .then(function() {

        },
        function() {

        });


    }])



