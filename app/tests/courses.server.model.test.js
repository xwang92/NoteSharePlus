'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course');

/**
 * Globals
 */
var user, school, course, course2;

/**
 * Unit tests
 */
describe('Course Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {

            school = new School({
				name: 'University of Courses',
				domain: 'courses.com'
			});

            school.save(function(){

                course = new Course({
    				name: 'Learn the ABCs',
    				code: 'ABC123',
    				school: school._id
    			});
                course2 = new Course({
    				name: 'something else',
    				code: 'ABC123',
    				school: school._id
    			});

                done();
            });

		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return course.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			course.name = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without code', function(done) {
			course.code = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

	    it('should be able to show an error when try to save without school Id', function(done) {
    		course.school = '';

    		return course.save(function(err) {
    			should.exist(err);
    			done();
    		});
    	});

	    it('should not be able to save if code + school is not unique', function(done) {

            course.save(function(){
                // code and school Id is still the same
                return course2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

    	});
	});

	afterEach(function(done) {
		Course.remove().exec();
		School.remove().exec();
		User.remove().exec();
		done();
	});
});
