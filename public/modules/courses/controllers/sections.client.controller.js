'use strict';

angular.module('courses').controller('SectionsController', ['$scope', '$state', 'Sections', 'UserCourses',
	function($scope, $state, Sections, UserCourses) {

        $scope.init = function(){
            $scope.section = Sections.get({
                sectionId: $state.params.sectionId
            });
	    };

		$scope.courseId = $state.params.courseId;
		$scope.sectionId = $state.params.sectionId;

 		$scope.addSection = function () {
 		    var sectionId = {
 		        section: $state.params.sectionId
 		    }
            UserCourses.addCourseToUser($state.params.courseId, sectionId);
        };

        $scope.removeSection = function () {
             UserCourses.removeCourseFromUser($state.params.courseId);
         };

        $scope.uploadPage = function() {
            $state.go('uploadPage', {
                courseId: $scope.courseId,
                sectionId: $scope.sectionId
            });
        };
    }
]);
