'use strict';

//Courses service used for communicating with the courses REST endpoints
angular.module('courses').factory('UserCourses', ['$http',
	function($http) {

        // course factory object
	    var userCourses = {};

	    // object storing current user courses
	    var _userCourses = {};

        userCourses.getUserCourses = function(callback){

            $http.get('/courses/user' ).success(function(response) {
				// If successful show success message and clear form
				_userCourses = response;
				callback(_userCourses);
			}).error(function(response) {
				callback(response.message);
			});
        };

        userCourses.addCourseToUser = function(courseId, sectionId){
            $http.post('/courses/user/' + courseId, sectionId).success(function(response) {
                _userCourses = response;
				callback(_userCourses);
			}).error(function(response) {
				callback(response.message);
			});
        }

        userCourses.removeCourseFromUser = function(courseId){
            $http.delete('/courses/user/' + courseId).success(function(response) {
                _userCourses = response;
				callback(_userCourses);
			}).error(function(response) {
				callback(response.message);
			});
        }

        return userCourses;
	}
]);
