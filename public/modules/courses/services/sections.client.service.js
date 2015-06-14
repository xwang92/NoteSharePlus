'use strict';

//Courses service used for communicating with the courses REST endpoints
angular.module('courses').factory('Sections', ['$resource',
	function($resource) {
		return $resource('sections/:sectionId', {
			sectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
