'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course'),
	Section = mongoose.model('Section');

/**
 * Globals
 */
var user, school, section, section2, course;

/**
 * Unit tests
 */
describe('Section Model Unit Tests:', function() {
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
				name: 'University of Sections',
				domain: 'sections.com'
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

                    // Create section
    			    section = new Section({
                        year: '2015',
                        term: 'Fall',
                        section:'LEC0101',
                        course: course._id
    			    });
    			    section2 = new Section({
                        year: '2015',
                        term: 'Fall',
                        section:'LEC0101',
                        course: course._id
    			    });
                    done();
    			});
            });
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return section.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without year', function(done) {
			section.year = '';

			return section.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without term', function(done) {
			section.term = '';

			return section.save(function(err) {
				should.exist(err);
				done();
			});
		});

	    it('should be able to show an error when try to save without section name', function(done) {
    		section.section = '';

    		return section.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});
        it('should be able to show an error when try to save without course Id', function(done) {
    		section.course = '';

    		return section.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

        it('should not save unless year, term, sections are all unique', function(done) {
    		section.save(function(){
                return section2.save(function(err) {
                    should.exist(err);
                    done();
                });
    		});
    	});

	});

	afterEach(function(done) {
		Section.remove().exec();
		Course.remove().exec();
		School.remove().exec();
		User.remove().exec();
		done();
	});
});
