'use strict';

angular.module('core').controller('SearchBarController', ['$scope', '$rootScope', '$location','$state', 'Schools',
	function($scope, $rootScope, $location, $state, Schools) {
        $scope.viewModel = {};
        $scope.viewModel.selectedCourse= null;

        $scope.init = function(){
            Schools.populateCoursesFromServer(function(courses){
                $scope.availableCourses = courses;
            });
        };

		// Function to go to course page
        $scope.viewCourse = function() {
            if($scope.viewModel.selectedCourse) {
                //$state.go('course', {courseCode: $scope.viewModel.selectedCourse.code});
                $state.go('course', {
                    courseId: $scope.viewModel.selectedCourse._id
                });
            }   
        };
	}
]);
