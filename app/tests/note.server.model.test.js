'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course'),
	Section = mongoose.model('Section'),
	Note = mongoose.model('Note');

/**
 * Globals
 */
var user, school, section, note, note2, course;

/**
 * Unit tests
 */
describe('Note Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
        // Create User and add to data base
		user.save(function() {

            school = new School({
				name: 'University of Notes',
				domain: 'notes.com'
			});
            // Create School and add to data base
            school.save(function(){

                course = new Course({
    				name: 'Learn the ABCs',
    				code: 'ABC123',
    				school: school._id
    			});
                // Create Course and add to data base
    			course.save(function(){

    			    section = new Section({
                        year: '2015',
                        term: 'Fall',
                        note:'LEC0101',
                        course: course._id
    			    });
                    // Create and save section
                    section.save(function(){
                        note = new Note({
                            name: 'some fancy piece of note',
                            noteType: 'Lecture',
                            fileType: 'Image',
                            date: '2015/09/03',
                            author: user._id,
                            section: section._id
                        });

                        note2 = new Note({
                            name: 'some fancy piece of note',
                            noteType: 'Lecture',
                            fileType: 'Image',
                            date: '2015/09/03',
                            author: user._id,
                            section: section._id
                        });

                        done();
                    })

    			});
            });
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return note.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			note.name = '';

			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without noteType', function(done) {
			note.noteType = '';

			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});

	    it('should be able to show an error when try to save without note fileType', function(done) {
    		note.fileType = '';

    		return note.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

        it('should be able to show an error when try to save without date', function(done) {
    		note.date = '';

    		return note.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

        it('should be able to show an error when try to save without author', function(done) {
    		note.author = '';

    		return note.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

        it('should be able to show an error when try to save without section', function(done) {
    		note.section = '';

    		return note.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

        it('should not save unless noteType, date and name are all unique', function(done) {
    		note.save(function(){
                return note2.save(function(err) {
                    should.exist(err);
                    done();
                });
    		});
    	});

	});

	afterEach(function(done) {
		Note.remove().exec();
		Section.remove().exec();
		Course.remove().exec();
		School.remove().exec();
		User.remove().exec();
		done();
	});
});
