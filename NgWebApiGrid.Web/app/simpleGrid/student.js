angular.module('ngWebApiGrid.student', ['ngRoute'])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "studentCtrl",
        templateUrl: "app/simpleGrid/student.tpl.html"
    });

    $routeProvider.otherwise("/");
}])

.controller("studentCtrl", ["$scope", "$http",
    function ($scope, $http) {
        $scope.controllerName = "studentCtrl";

}])



