/// <reference path="../scripts/jasmine.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular-route.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular-mocks.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular-local-storage.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular-animate.js" />
/// <reference path="../../ngwebapigrid.web/scripts/loading-bar.js" />
/// <reference path="../../ngwebapigrid.web/scripts/angular-ui/ui-bootstrap-tpls.js" />
/// <reference path="../../ngwebapigrid.web/app/simplegrid/student.js" />
describe("student-tests", function () {
    
    beforeEach(function () {

        module('ngWebApiGrid.student');
    });

    var $httpBackend;

    beforeEach(inject(function ($injector) {

        $httpBackend = $injector.get("$httpBackend");

        $httpBackend.when("GET", "api/StudentsApi?currentPage=1&recordsPerPage=5")
            .respond({
                "students": [{ "id": 1, "lastName": "Alexander", "firstMidName": "Carson", "enrollmentDate": "2005-09-01T00:00:00", "enrollments": null },
                    { "id": 2, "lastName": "Alonso", "firstMidName": "Meredith", "enrollmentDate": "2002-09-01T00:00:00", "enrollments": null },
                    { "id": 3, "lastName": "Anand", "firstMidName": "Arturo", "enrollmentDate": "2003-09-01T00:00:00", "enrollments": null },
                    { "id": 4, "lastName": "Barzdukas", "firstMidName": "Gytis", "enrollmentDate": "2002-09-01T00:00:00", "enrollments": null },
                    { "id": 5, "lastName": "Li", "firstMidName": "Yan", "enrollmentDate": "2002-09-01T00:00:00", "enrollments": null }], "recordCount": 32
            }
            );
    }));


    afterEach(function () {

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("dataService", function () {

        it("can load students", inject(function (dataService) {

            expect(dataService).toBeDefined();
            expect(dataService.students).toEqual([]);

            var options = {
                currentPage: 1,
                recordsPerPage: 5,
            };

            $httpBackend.expectGET("api/StudentsApi?currentPage=1&recordsPerPage=5");
            dataService.getStudents(options);
            $httpBackend.flush();
            expect(dataService.students.length).toEqual(5);

        }));
    });


    describe("studentCtrl", function () {

        it("loads data", inject(function ($controller, $rootScope) {

            var theScope = $rootScope.$new();

            $httpBackend.expectGET("api/StudentsApi?currentPage=1&recordsPerPage=5");

            var ctrl = $controller("studentCtrl", {
                $scope: theScope,

            });

            $httpBackend.flush();

            expect(ctrl).not.toBeNull();
            expect(theScope.data).toBeDefined();
            expect(theScope.currentPage).toBeDefined();
            expect(theScope.totalItems).toBeDefined();
            expect(theScope.maxSize).toBeDefined();
            expect(theScope.recordsPerPage).toBeDefined();
            expect(theScope.numberOfPageButtons).toBeDefined();

        }));

        it("studentCtrl should call dataService", inject(function ($controller, $rootScope, dataService) {

            var theScope = $rootScope.$new();

            $httpBackend.expectGET("api/StudentsApi?currentPage=1&recordsPerPage=5");

            var ctrl = $controller("studentCtrl", {
                $scope: theScope,
                dataService: dataService,
            });

            $httpBackend.flush();

            expect(theScope.totalItems).toEqual(32);
            expect(theScope.data.length).toEqual(5);

        }));

    });

});

