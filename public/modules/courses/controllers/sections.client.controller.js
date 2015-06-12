'use strict';

angular.module('courses').controller('SectionsController', ['$scope', '$state', 'Sections',
	function($scope, $state, Sections) {

        $scope.init = function(){
            $scope.section = Sections.get({
                sectionId: $state.params.sectionId
            });
	    };

		/*
			Note object format
			{
			    "_id": <ObjectId>,
			    "__v": int,
			    "name": string,
			    "noteType": [“Lecture”, “Tutorial”, “HomeWork”, “Exam”, “Other”],
			    “fileType”: [“Image”, “Doc”],
			    “number”: string, (ex: lecture number 5),
			    “date”: Date,
			    “rating”: String,
			    “ratingCount”: String, (default 0)
			    “Location”: [
					string (filepath to page 1),
					string (filepath to page 2),
					…
				]
			    “thumbNail”: string (location)
			    "tags” : [
					note.ObjectId,
					note.ObjectId
				    ],
			    “author”: author.ObjectId,
			    “section”: section.ObjectId
			}
		*/

		$scope.courseId = $state.params.courseId;
		$scope.sectionId = $state.params.sectionId;

        $scope.uploadPage = function() {
            $state.go('uploadPage', {
                courseId: $scope.courseId,
                sectionId: $scope.sectionId
            });
        };
    }
]);
