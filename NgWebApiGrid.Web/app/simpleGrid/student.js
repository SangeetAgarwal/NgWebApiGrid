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

        var _getStudents = function (options) {

            var deferred = $q.defer();

            $http.get("api/StudentsApi?currentPage=" + options.currentPage + "&" +
                "recordsPerPage=" + options.recordsPerPage + "&" +
                "sortKey=" + options.sortKeyOrder.key + "&" + "sortOrder=" + options.sortKeyOrder.order + "&searchfor=" + options.searchfor)
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

            var sortKeyOrder = {
                key: '',
                order: '',
            };

            if (localStorageService.get("searchfor") !== undefined) {
                $scope.searchfor = localStorageService.get("searchfor");
            }


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

            $scope.search = function (searchfor) {

                if (searchfor === undefined) {
                    $scope.searchfor = "";
                }

                localStorageService.set("searchfor", searchfor);

                getData($scope, dataService, localStorageService);
            }


        }]);


var getData = function ($scope, dataService, localStorageService) {

    $scope.data = dataService.students;
    var sortKeyOrder = localStorageService.get('sortKeyOrder');

    if (sortKeyOrder == null) {
        sortKeyOrder = {
            key: 'lastName',
            order: 'ASC',
        };
    }

    var searchfor = localStorageService.get('searchfor');

    $scope.sortKeyOrder = sortKeyOrder;

    var options = {

        currentPage: $scope.currentPage,
        recordsPerPage: $scope.recordsPerPage,
        sortKeyOrder: sortKeyOrder,
        searchfor: searchfor,

    };


    dataService.getStudents(options)
    .then(function (totalItems) {
        $scope.totalItems = totalItems;
    },
    function () {

        alert("an error occured: unable to get data");
    });

};



