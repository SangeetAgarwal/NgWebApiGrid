angular.module('ngWebApiGrid.student', ['ngRoute', 'ui.bootstrap', 'chieffancypants.loadingBar'])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "studentCtrl",
            templateUrl: "app/simpleGrid/students.tpl.html"
        });

        $routeProvider.when("/new-student", {
            controller: "newStudentCtrl",
            templateUrl: "app/simpleGrid/newStudent.tpl.html"
        });

        $routeProvider.otherwise("/");
    }])
     .directive("saveButton", [function () {
         return {
             restrict: "E",
             replace: true,
             scope: {
                 text: "@",
                 action: "&",
                 comment: "="
             },
             template: "<button type='button' class='btn btn-primary' style='width: 75px;height: 30px' ng-click='action()'>{{text}}</button>"
         };
     }])

    .directive("deleteButton", [function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                text: "@",
                cssclass: "@",
                action: "&",
                comment: "="
            },
            template: "<button type='button' class='{{cssclass}}' style='width: 75px;height: 30px' ng-click='action()'>{{text}}</button>"
        };
    }])
    .controller('modalConfirmationInstanceCtrl', ["$scope", "$modalInstance", "message",
        "title", "id", "showCancel", function ($scope, $modalInstance, message, title, id, showCancel) {

            $scope.message = message;
            $scope.title = title;
            $scope.showCancel = showCancel;

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }])

        .factory("modalConfirmationService", ["$log", "$modal", function ($log, $modal) {

            var _getModalInstance = function (title, message, id, showCancel) {

                return $modal.open({
                    templateUrl: 'app/simpleGrid/modalConfirmation.tpl.html',
                    controller: 'modalConfirmationInstanceCtrl',
                    size: 'sm',
                    resolve: {
                        title: function () {
                            return title;
                        },
                        message: function () {
                            return message;
                        },
                        id: function () {
                            return id;
                        },
                        showCancel: function () {
                            return showCancel;
                        },
                    }
                });

            };

            return {
                getModalInstance: _getModalInstance
            };
        }])

    .factory("dataService", ["$http", "$q", function ($http, $q) {

        var _students = [];

        var _getStudents = function (options) {

            var deferred = $q.defer();

            $http.get("api/StudentsApi?currentPage=" + options.currentPage + "&" +
                "recordsPerPage=" + options.recordsPerPage + "&" +
                "sortKey=" + options.sortKeyOrder.key + "&" + "sortOrder=" + options.sortKeyOrder.order + "&searchfor=" + options.searchfor)
                .then(

                function (result) {
                    angular.copy(result.data.students, _students);
                    deferred.resolve(result.data.recordCount);
                },

                function () {
                    deferred.reject();
                });

            return deferred.promise;
        };

        var _postStudent = function (record) {

            var deferred = $q.defer();

            $http.post("api/StudentsApi", record).then(

                function (result) {
                    deferred.resolve(result.data);
                },

                function () {
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        var _deleteStudent = function (id) {

            var deferred = $q.defer();

            $http.delete("api/StudentsApi/" + id).then(

                function (result) {
                    deferred.resolve(result.data);
                },

                function () {
                    deferred.reject();
                }

            );

            return deferred.promise;

        }

        return {
            students: _students,
            getStudents: _getStudents,
            postStudent: _postStudent,
            deleteStudent: _deleteStudent,
        };
    }])
    .controller("newStudentCtrl", ["$scope", "$http", "$window", "dataService", "modalConfirmationService",
        function ($scope, $http, $window, dataService, modalConfirmationService) {

            $scope.newStudent = {

            };

            $scope.save = function () {

                dataService.postStudent($scope.newStudent)
                    .then(
                        function (newStudent) {
                            modalConfirmationService.getModalInstance("record saved", "added student with last name =" + newStudent.lastName);

                        },
                        function () {
                            modalConfirmationService.getModalInstance("record saved", "could not save the new student, please try again");

                        })
                    .then(function () {
                        $window.location = "#";
                    });
            };
        }])
    .controller("studentCtrl", ["$scope", "dataService", "localStorageService", "modalConfirmationService",
        function ($scope, dataService, localStorageService, modalConfirmationService) {

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


            $scope.save = function (id) {

                var record = $scope.data.filter(function (v) { return v["id"] == id; });

                dataService.postStudent(record[0])
                    .then(function (updatedStudentRecord) {
                        modalConfirmationService.getModalInstance("the following record has been updated", "updated student record with last name = " + updatedStudentRecord.lastName);
                    },
                        function () {
                            modalConfirmationService.getModalInstance("failed to save the changes, please try again");
                        });
            };


            $scope.delete = function (id) {

                var record = $scope.data.filter(function (v) { return v["id"] == id; });

                modalConfirmationService.getModalInstance("delete record", "are you sure you would like to delete the student record with last name = " + record[0].lastName, id, true).result.
                    then(function () {
                        dataService.deleteStudent(id)
                            .then(function (deletedRecord) {
                                modalConfirmationService.getModalInstance("deleted record", "record with last name = " + deletedRecord.lastName + " has been deleted!");
                                getData($scope, $http, dataService, localStorageService, modalConfirmationService);
                            }, function () {
                                modalConfirmationService.getModalInstance("error occured", " an error occured while attempting to delete record, please try again");
                            });

                    }, function () {
                        //called when modal confirmation dialog is dismissed
                    });

            };


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



