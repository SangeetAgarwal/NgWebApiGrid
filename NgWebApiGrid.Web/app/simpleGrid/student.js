angular.module('ngWebApiGrid.student', ['ngRoute', 'ui.bootstrap'])
    .config(["$routeProvider", function($routeProvider) {
        $routeProvider.when("/", {
            controller: "studentCtrl",
            templateUrl: "app/simpleGrid/students.tpl.html"
        });

        $routeProvider.otherwise("/");
    }])
    .factory("dataService", ["$http", "$q", function($http, $q) {

        var _students = [];

        var deferred = $q.defer();

        var _getStudents = function(options) {

            $http.get("api/StudentsApi?currentPage=" + options.currentPage + "&" + "recordsPerPage=" + options.recordsPerPage)
                .then(function(result) {
                    angular.copy(result.data.students, _students);
                    deferred.resolve(result.data.recordCount);
                },
                    function() {
                        deferred.reject();
                    });

            return deferred.promise;
        };

        return {
            students: _students,
            getStudents: _getStudents,
        };
    }])
    .controller("studentCtrl", ["$scope", "dataService",
        function($scope, dataService) {
            $scope.data = dataService.students;

            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.recordsPerPage = 5;
            $scope.NumberOfPageButtons = 5;
            
            getData($scope, dataService);

            $scope.pageChanged = function() {

                getData($scope, dataService);
            };


        }]);


var getData = function ($scope, dataService) {

    var options = {        
        
    };
    options.currentPage = $scope.currentPage;
    options.recordsPerPage = $scope.recordsPerPage;

    dataService.getStudents(options)
    .then(function (totalItems) {
        
        $scope.totalItems = totalItems;
    },
    function () {
        
        alert("an error occured: unable to get data");
    });

};



