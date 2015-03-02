'use strict';

angular.module('notes')
    .directive('courseAccordion', function () {
        return {
            templateUrl: 'modules/notes/views/course.accordion.client.view.html',
            scope: {},
            link: function (scope) {
                scope.courses = [
                    {
                        title: 'ZUBAIR101',
                        content: 'ZubairBOMB'
                    },
                    {
                        title: 'PEE TER 101',
                        content: 'pee tear griffin'
                    }
                ];

                scope.$on('add-course', function(event, args){
                    scope.courses.push(args.course);
                });
            }
        };
    });
