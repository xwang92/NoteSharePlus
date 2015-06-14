'use strict';

// Setting up route
angular.module('lectures').config(['$stateProvider',
	function($stateProvider) {
		// Lecture state routing
		$stateProvider.
		state('lecture', {
			url: '/course/:courseId/section/:sectionId/lecture/:lectureId',
			templateUrl: 'modules/lectures/views/view-lecture.client.view.html'
		}).
		state('uploadPage', {
			url: '/course/:courseId/section/:sectionId/upload',
			templateUrl: 'modules/lectures/views/create-lecture.client.view.html'
		});
	}
]);
