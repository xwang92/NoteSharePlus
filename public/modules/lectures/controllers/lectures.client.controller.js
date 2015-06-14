'use strict';

angular.module('lectures').controller('LecturesController', ['$scope', '$rootScope', '$state', 'Lectures',
	function($scope, $rootScope, $state, Lectures) {

        $scope.init = function(){
            updateLecture();
	    };

        $scope.createNote = function(){

            var note = {
                name: $scope.name,
                noteType: $scope.noteType,
                fileType: $scope.fileType,
                date: $scope.date,
                section: $state.params.sectionId
            };

            $scope.currentUpload = note;

            Lectures.createLecture(note, function(resLecture){
                $scope.response = resLecture;
            });
	    };

        $scope.addTag = function(){
            var params = {
                tags: $scope.tagName
            };

            Lectures.createTag($state.params.lectureId, params , function(resTag){
                $scope.tag = resTag;
                updateLecture();
            });
	    };

        // not working
        $scope.removeTag = function(){
            var params = {
                tags: 'tag1'
            };

            Lectures.removeTag($state.params.lectureId, params, function(resLecture){
                $scope.tag = resTag;
                updateLecture();
            });
	    };

        function updateLecture(){
            Lectures.getLectureById($state.params.lectureId, function(resLecture){
                $scope.lecture = resLecture;
            });
        }

        // get array of files
        $scope.uploadImage = function(){
            $scope.myFiles = $scope.myFile;
        };

    }
]);
