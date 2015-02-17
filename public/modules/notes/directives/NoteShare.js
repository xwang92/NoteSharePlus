'use strict';

angular.module('notes')
    .directive('noteShare', ['Authentication', '$location', function (MAIN_PANEL_STATE) {
        return {
            templateUrl: 'modules/notes/views/notes.renderer.view.html',
            scope: {},
            link: function (scope) {
                scope.viewModel = {};
                scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;

                scope.toggleView = function() {
                    if (scope.viewModel.mainPanelState === MAIN_PANEL_STATE.COURSE_NOTES) {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_OUTLINE;
                    }
                    else {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;
                    }
                };
            },
            controller: function($scope, Authentication, $location) {
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
