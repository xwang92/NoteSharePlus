'use strict';

// Setting up route
angular.module('courses').config(['$stateProvider',
	function($stateProvider) {
		// Course state routing
		$stateProvider.
		state('course', {
			url: '/course/:courseId',
			templateUrl: 'modules/courses/views/view-course.client.view.html'
		}).
		state('course.section', {
			url: '/section/:sectionId',
			templateUrl: 'modules/courses/views/view-section.client.view.html'
		});
	}
]);
