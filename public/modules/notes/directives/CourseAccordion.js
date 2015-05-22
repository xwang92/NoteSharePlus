'use strict';

angular.module('notes')
    .directive('courseAccordion', function () {
        return {
            templateUrl: 'modules/notes/views/course.accordion.client.view.html',
            scope: {},
            link: function (scope) {
                // Load courses from user from db into scope.course
                scope.courses = [
                    {
                        'title': 'ZUBAIR101',
                        'notes': [
                            {
                                'noteNum': 'note 1'
                            },
                            {
                                'noteNum': 'note 2'
                            },
                            {
                                'noteNum': 'note 3'
                            }
                        ]
                    },
                    {
                        'title': 'PEE TER 101',
                        'notes': [
                            {
                                'noteNum': 'note 1'
                            }
                        ]
                    }
                ];

                scope.$on('add-course', function(event, args){
                    scope.courses.push(args.course);
                });
            }
        };
    });
