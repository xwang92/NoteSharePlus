'use strict';

angular.module('core').controller('SearchBarController', ['$scope', '$rootScope', '$location','$state',
	function($scope, $rootScope, $location, $state) {
        $scope.viewModel = {};
        $scope.viewModel.selectedCourse= null;
        // TODO: make backend call to get availiable courses
        // OR, get courses on the fly during search
        $scope.availableCourses = [
            /*
                Course object format
                {    
                    _id: '<ObjectId>',
                    __v: 'int',
                    name: 'String',
                    code: 'String',
                    description : 'String',
                    school:  'school.ObjectId',
                    section: '[String]'
                },
            */
            {
                name: 'Course 1',
                code: 'CRS101',
                description: 'Course 1 content'
            },
            {
                name: 'Course 2',
                code: 'CRS102',
                description: 'Course 2 content'
            },
            {
                name: 'Course 3',
                code: 'CRS103',
                description: 'Course 3 content'
            },
        ];
		// Function to go to course page
        $scope.viewCourse = function() {
            if($scope.viewModel.selectedCourse) {
                $state.go('course', {courseCode: $scope.viewModel.selectedCourse.code});
            }   
        };
	}
]);