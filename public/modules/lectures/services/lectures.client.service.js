'use strict';

//Schools service used for communicating with the lectures REST endpoints
angular.module('lectures').factory('Lectures', ['$http', 'Authentication',
	function($http, Authentication) {

        // lecture factory object
	    var lecture = {};

        // JSON object, instance of a lecture in backend
        var _lecture = {};
        var _lectureArray = {};

    //
    // GET notes by ... Returns a instance or array of Note documents
    //

        lecture.getLectureById = function(noteId, callback){
            $http.get('/notes/' + noteId ).success(function(response) {
				_lecture = response;
				callback(_lecture);
			}).error(function(response) {
				callback(response.message);
			});
        };
        // not tested
        lecture.getLecturesByAuthor = function(authorId, callback){
            $http.get('/notes', {params: {author: authorId}} ).success(function(response) {
				_lectureArray = response;
				callback(_lectureArray);
			}).error(function(response) {
				callback(response.message);
			});
        }
        // not tested
        lecture.getLecturesByTag = function(tagName, callback){
            $http.get('/notes', {params: {tag: tagName}} ).success(function(response) {
				_lectureArray = response;
				callback(_lectureArray);
			}).error(function(response) {
				callback(response.message);
			});
        }
        // not tested
        lecture.getLecturesFromSection = function(sectionId, callback){
            $http.get('/notes', {params: {section: sectionId}} ).success(function(response) {
				_lectureArray = response;
				callback(_lectureArray);
			}).error(function(response) {
				callback(response.message);
			});
        }
        // not tested
        lecture.getLecturesFromUser = function(callback){
            $http.get('/notes/').success(function(response) {
				_lectureArray = response;
				callback(_lectureArray);
			}).error(function(response) {
				callback(response.message);
			});
        }

    //
    // GET the image or doc the actual notes is in
    // NOT VERIFIED

        lecture.getImage = function(){
            $http.get('/notes/' + lectureId ).success(function(response) {
				// If successful show success message and clear form
				_lecture = response;
				callback(_lecture);
			}).error(function(response) {
				callback(response.message);v
			});
        }

        lecture.getDoc = function(){
            $http.get('/notes/' + lectureId ).success(function(response) {
				// If successful show success message and clear form
				_lecture = response;
				callback(_lecture);
			}).error(function(response) {
				callback(response.message);
			});
        }

    //
    // POST notes to server
    //

        lecture.createLecture = function(newLecture){
            $http.post('/notes', newLecture ).success(function(response) {
				callback(response);
			}).error(function(response) {
				callback(response.message);
			});
        }

    //
    // DELETE notes from server
    //
        // not tested
        lecture.removeLecture = function(removedLecture){
            $http.delete('/notes' + removedLecture ).success(function(response) {
				callback(response);
			}).error(function(response) {
				callback(response.message);
			});
        }

     //
     // PUT/DELETE Tags
     //

         lecture.createTag = function(lectureId, param){
             $http.put('/notes/tags/' + lectureId, param).success(function(response) {
 				// If successful show success message and clear form
 				callback(response);
 			}).error(function(response) {
 				callback(response.message);
 			});
         }

         // NOT WORKING RIGHT NOW
         lecture.removeTag = function(lectureId, param){
             $http.delete('/notes/tags/' + lectureId, param ).success(function(response) {
 				// If successful show success message and clear form
 				callback(response);
 			}).error(function(response) {
 				callback(response.message);
 			});
         }

     //
     // Add Rating
     //
        // not tested
         lecture.addRating = function(newLecture){
             $http.get('/notes/' + lectureId ).success(function(response) {
 				// If successful show success message and clear form
 				_lecture = response;
 				callback(_lecture);
 			}).error(function(response) {
 				callback(response.message);
 			});
         }

     //
     // Flag as spam
     //
        // function does not exist yet
         lecture.flagAsSpam = function(newLecture){
             $http.get('/notes/' + lectureId ).success(function(response) {
 				// If successful show success message and clear form
 				_lecture = response;
 				callback(_lecture);
 			}).error(function(response) {
 				callback(response.message);
 			});
         }

        return lecture;
	}
]);

