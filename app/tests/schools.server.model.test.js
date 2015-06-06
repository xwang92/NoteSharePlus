'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School');

/**
 * Globals
 */
var user, school, school2;

/**
 * Unit tests
 */
describe('School Model Unit Tests:', function() {
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
				name: 'University of Testing',
				domain: 'testing.com'
			});

            school2 = new School({
				name: 'University of Testing',
				domain: 'testing.com'
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return school.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			school.name = '';

			return school.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without domain', function(done) {
            school.name = 'University of Testing';
			school.domain = '';

			return school.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should not allow duplicate names', function(done) {
            // save first school
            school.save(function(){
                school2.name = school.name;
                return school2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
		});

        it('should not allow duplicate domains', function(done) {
            // save first school
            school.save(function(){
                school2.domain = school.domain;
                return school2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
		});

	});

	afterEach(function(done) {
		School.remove().exec();
		User.remove().exec();
		done();
	});
});
