'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$rootScope', '$state', 'Courses',
	function($scope, $rootScope, $state, Courses) {

	    $scope.init = function(){
            $scope.course = Courses.get({
                courseId: $state.params.courseId
            });
	    };

		$scope.selectedSection = null;

		$scope.courseId = $state.params.courseId;

    }
]);
