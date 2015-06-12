'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$rootScope', '$state', 'Courses',
	function($scope, $rootScope, $state, Courses) {

	    $scope.init = function(){
            $scope.course = Courses.get({
                courseId: $state.params.courseId
            });
	    };

		$scope.selectedSection = null;
		/*
			Section object format
			{
			    "_id": <ObjectId>,
			    "__v": int,
			    "year": String,
			    "term": [“Fall”, “Winter”],
			    “section”: String,
			    “course”:  course.ObjectId,
			    "notes” : [
					note.ObjectId,
					note.ObjectId
				]
			}

		$scope.availiableSections = [
			{
                section: '1',
            },
            {
                section: '2',
            },
            {
                section: '3',
            },
		];*/
		// TODO: Get actual course object from backend using courseCode from stateParams
		$scope.courseId = $state.params.courseId;

 		$scope.addCourse = function () {
            $rootScope.$broadcast('add-course', {code: $scope.courseId});
        };
    }
]);
