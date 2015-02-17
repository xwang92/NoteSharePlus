'use strict';

angular.module('notes')
    .directive('noteShare', function (MAIN_PANEL_STATE) {
        return {
            templateUrl: 'modules/notes/views/notes.renderer.view.html',
            scope: {},
            link: function (scope) {
                scope.viewModel = {};
                scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;
                console.log(scope.viewModel);

                scope.toggleView = function() {
                    if (scope.viewModel.mainPanelState === MAIN_PANEL_STATE.COURSE_NOTES) {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_OUTLINE;
                    }
                    else {
                        scope.viewModel.mainPanelState = MAIN_PANEL_STATE.COURSE_NOTES;
                    }
                    console.log(scope.viewModel.mainPanelState);
                };
            }
        };
    })
    .constant('MAIN_PANEL_STATE', {
        COURSE_OUTLINE: 'courseOutline',
        COURSE_NOTES: 'courseNotes'
    });
