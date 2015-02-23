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
                    $rootScope.$broadcast('add-course', {course: scope.displayedCourse});
                };
            }
        };
    });
