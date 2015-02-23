'use strict';

angular.module('notes')
    .directive('noteShare', ['Authentication', '$location', 'MAIN_PANEL_STATE', function (Authentication,
                                                                                          $location,
                                                                                          MAIN_PANEL_STATE) {
        return {
            templateUrl: 'modules/notes/views/notes.renderer.view.html',
            scope: {},
            link: function (scope) {
                scope.viewModel = {};
                scope.viewModel.selectedCourse= null;
                scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;
                scope.course = null;
                scope.toggleView = function() {
                    if (scope.viewModel.mainPanelState === MAIN_PANEL_STATE.COURSE_NOTES) {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_OUTLINE;
                    }
                    else {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;
                    }
                };
                scope.availableCourses = [
                    {
                        title: 'Course 1',
                        content: 'Course 1 content'
                    }
                ];

                scope.viewCourse = function() {
                    scope.course = scope.viewModel.selectedCourse;
                    scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_OUTLINE;
                };
            },

            controller: function($scope) {
                // This provides Authentication context.
                $scope.authentication = Authentication;
                // If user is not signed in then redirect to sign in page
                if (!$scope.authentication.user) $location.path('/signin');
            }
        };
    }])
    .constant('MAIN_PANEL_STATE', {
        COURSE_OUTLINE: 'courseOutline',
        COURSE_NOTES: 'courseNotes'
    });
