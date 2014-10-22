angular.module('ngWebApiGrid', ['ngWebApiGrid.student', 'LocalStorageModule'])

.config(function ($routeProvider) {
    $routeProvider.otherwise("/");
})

.run(function run() {

});