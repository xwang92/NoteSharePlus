'use strict';

//Schools service used for communicating with the schools REST endpoints
angular.module('core').factory('Schools', ['$http',
	function($http) {

        // school factory object
	    var school = {};

        // JSON object, instance of a school in backend
        var _school = {
            name: 'University of Toronto',
            _id: '557e5aefa6bff94b4a9cd859'
        };

	    var _courses = [];

        school.populateCoursesFromServer = function(callback){

            $http.get('/courses', {params: {school: _school._id}} ).success(function(response) {
				// If successful show success message and clear form
				_courses = response;
				callback(_courses);
			}).error(function(response) {
				callback(response.message);
			});
        };

        school.getCourses = function(){
            return _courses;
        }

        /*school.addToUser = function(){

        }*/

        return school;
	}
]);


        /*
        //Get ID from name instead of hard coded ID.
        //Alternative is _id turns to be unreliable

        var _schoolName = "University of Toronto";

	    school.setSchoolName = function(name){
	        _schoolName = name;
	    }

	    school.getSchoolName = function(name){
        	return _schoolName;
        }

        school.getSchoolByName = function(callback){

            $http.get('/schools',  {params: {name: _schoolName}}).success(function(response) {
				// If successful show success message and clear form
				_school = response[0];
				callback(response);
			}).error(function(response) {
				callback(response.message);
			});
        }*/
