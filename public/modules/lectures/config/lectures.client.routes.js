'use strict';

// Setting up route
angular.module('lectures').config(['$stateProvider',
	function($stateProvider) {
		// Lecture state routing
		$stateProvider.
		state('lecture', {
			url: '/course/:courseCode/section/:sectionNum/lecture/:lectureNum',
			templateUrl: 'modules/lectures/views/view-lecture.client.view.html'
		});
	}
]);