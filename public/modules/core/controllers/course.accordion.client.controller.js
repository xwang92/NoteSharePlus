'use strict';

angular.module('core').controller('CourseAccordionController', ['$scope', '$state', 'UserCourses', 'AppSettings', 
	function($scope, $state, UserCourses, AppSettings) {

	    $scope.init = function() {
            UserCourses.getUserCourses(function(userCourses){
                $scope.courses = userCourses;
            });
	    };

	    $scope.$on(AppSettings.ACTION_ADD_SECTION, function(event, args) {
	    		$scope.courses.push(args);
	    });

	    $scope.removeSection = function(index) {
	    	// Remove in db
            UserCourses.removeCourseFromUser($scope.courses[index].courseId);
            // Remove in UI
            $scope.courses.splice(index, 1);
        };
	}
]);
