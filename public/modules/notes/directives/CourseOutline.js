'use strict';

angular.module('notes')
    .directive('courseOutline', function ($rootScope) {
        return {
            scope: {
                displayedCourse: '=course'
            },
            templateUrl: 'modules/notes/views/course.outline.client.view.html',
            link: function (scope) {
                scope.addCourse = function () {
                    // TODO: add section to broadcast arg
                    $rootScope.$broadcast('add-course', {course: scope.displayedCourse});
                };
            }
        };
    });
