'use strict';

angular.module('courses').controller('SectionsController', ['$scope', '$rootScope', '$state', 'Sections', 'Courses', 'UserCourses', 'AppSettings',
	function($scope, $rootScope, $state, Sections, Courses, UserCourses, AppSettings) {
        $scope.init = function(){
            $scope.section = Sections.get({
                sectionId: $state.params.sectionId
            });
	    };

		$scope.courseId = $state.params.courseId;
		$scope.sectionId = $state.params.sectionId;

        // Course array to be populated by UserCourses service function callbacks, and replace current courselist
        $scope.userCourses = null;

 		$scope.addSection = function () {
 		    var sectionId = {
 		        section: $state.params.sectionId
 		    };

            UserCourses.addCourseToUser($state.params.courseId, sectionId);

            // Get course object with courseId
            $scope.course = Courses.get({
                courseId: $state.params.courseId
            });
            // Broadcast addSection action
            $rootScope.$broadcast(AppSettings.ACTION_ADD_SECTION, $scope.course);
        };

        $scope.uploadPage = function() {
            $state.go('uploadPage', {
                courseId: $scope.courseId,
                sectionId: $scope.sectionId
            });
        };
    }
]);
