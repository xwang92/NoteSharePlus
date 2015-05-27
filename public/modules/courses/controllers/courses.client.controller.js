'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
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
		*/
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
		];
		// TODO: Get actual course object from backend using courseCode from stateParams
		$scope.courseCode = $state.params.courseCode;

 		$scope.addCourse = function () {
            $rootScope.$broadcast('add-course', {code: $scope.courseCode});
        };
    }
]);