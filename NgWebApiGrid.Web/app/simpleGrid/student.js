angular.module('ngWebApiGrid.student', ['ngRoute', 'ui.bootstrap', 'chieffancypants.loadingBar'])
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

            $http.get("api/StudentsApi?currentPage=" + options.currentPage + "&" +
                "recordsPerPage=" + options.recordsPerPage + "&" +
                "sortKey=" + options.sortKeyOrder.key + "&" + "sortOrder=" + options.sortKeyOrder.order)
                .then(function (result) {
                    angular.copy(result.data.students, _students);
                    deferred.resolve(result.data.recordCount);
                },
                    function () {
                        deferred.reject();
                    });

            return deferred.promise;
        };

        return {
            students: _students,
            getStudents: _getStudents,
        };
    }])
    .controller("studentCtrl", ["$scope", "dataService", "localStorageService",
        function ($scope, dataService, localStorageService) {
            
            $scope.data = dataService.students;

            var sortKeyOrder = {
                key: '',
                order: '',
            };
            
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.recordsPerPage = 5;
            $scope.numberOfPageButtons = 5;
          

            getData($scope, dataService, localStorageService);

            $scope.sort = function (col) {

                sortKeyOrder = localStorageService.get('sortKeyOrder');

                if (sortKeyOrder !== null && sortKeyOrder.key === col) {

                    if (sortKeyOrder.order == 'ASC')
                        sortKeyOrder.order = 'DESC';
                    else
                        sortKeyOrder.order = 'ASC';

                    localStorageService.set('sortKeyOrder', sortKeyOrder);

                } else {
                    
                    sortKeyOrder = {
                        key: col,
                        order: 'ASC',
                    };
                    
                    localStorageService.set('sortKeyOrder', sortKeyOrder);

                }
            };

            $scope.pageChanged = function () {

                getData($scope, dataService, localStorageService);
            };


        }]);


var getData = function ($scope, dataService, localStorageService) {


    var sortKeyOrder = localStorageService.get('sortKeyOrder');

    if (sortKeyOrder == null) {
        sortKeyOrder = {
            key: 'lastName',
            order: 'ASC',
        };
    }
    
    $scope.sortKeyOrder = sortKeyOrder;

    var options = {
        
        currentPage: $scope.currentPage,
        recordsPerPage: $scope.recordsPerPage,
        sortKeyOrder: sortKeyOrder,
    };


    dataService.getStudents(options)
    .then(function (totalItems) {

        $scope.totalItems = totalItems;
    },
    function () {

        alert("an error occured: unable to get data");
    });

};



