'use strict';

angular.module('core').controller('CourseAccordionController', ['$scope', '$state', 'UserCourses', 'AppSettings', 
	function($scope, $state, UserCourses, AppSettings) {

	    $scope.init = function() {
            UserCourses.getUserCourses(function(userCourses){
                $scope.courses = userCourses;

                // This is part of the hacky thing below, sucks
                for (var i = $scope.courses.length - 1; i >= 0; i--) {
                	$scope.courses[i]._id = $scope.courses[i].courseId;
                };
            });
	    };

	    // This thing is hacky as fuck, I do not like it, need better solution
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
