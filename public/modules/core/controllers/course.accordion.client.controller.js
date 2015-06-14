'use strict';

angular.module('core').controller('CourseAccordionController', ['$scope', 'UserCourses',
	function($scope, UserCourses) {

	    $scope.init = function(){
            UserCourses.getUserCourses(function(userCourses){
                $scope.courses = userCourses;
            });
	    };

	}
]);
