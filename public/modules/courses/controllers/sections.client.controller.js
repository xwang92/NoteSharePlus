'use strict';

angular.module('courses').controller('SectionsController', ['$scope', '$state',
	function($scope, $state) {
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
		// TODO: Get actual section numbers using state params
		$scope.courseCode = $state.params.courseCode;
		$scope.sectionNum = $state.params.sectionNum;
		$scope.availiableLectures = [
			{
                number: '1',
            },
            {
                number: '2',
            },
            {
                number: '3',
            },
            {
                number: '4',
            },
            {
                number: '5',
            },
		];
    }
]);