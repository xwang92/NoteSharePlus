'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course'),
	agent = request.agent(app);

/**
 * Globals
 */
var admin_credentials, admin, course, course2;
var user_credentials, user;
var school, school2;

/**
 * Course routes tests
 */
describe('Course CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		admin_credentials = {
			username: 'username',
			password: 'password'
		};

		user_credentials = {
            username: 'username2',
            password: 'password2'
        };

		school = new School({
			name: 'University of Testing',
			domain: 'test.com'
		});

        school2 = new School({
			name: 'University of Random Stuff',
			domain: 'random.com'
		});

        school.save(function(){

            // Create a new user
            admin = new User({
                firstName: 'Full',
                lastName: 'Name',
                displayName: 'Full Name',
                email: 'test@test.com',
                roles: 'admin',
                school: school._id,
                username: admin_credentials.username,
                password: admin_credentials.password,
                provider: 'local'
            });

            user = new User({
                firstName: 'Full',
                lastName: 'Name',
                displayName: 'Full Name',
                email: 'test@test.com',
                roles: 'user',
                school: school._id,
                username: user_credentials.username,
                password: user_credentials.password,
                provider: 'local'
            });

            course = {
    		    name: 'Testing 123',
    			code: 'TES123',
    			school: school._id
    		};

            course2 = {
    		    name: 'Intro to Testing',
    			code: 'INT123',
    			school: school._id
    		};

            school2.save();
            user.save();

    		admin.save(function() {
    		    done();
    		});

        });
	});

	it('should be able to add course to user if logged in and course school matches user school', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);
                    // Add Course
				    var courseObj = new Course(course);
                    courseObj.save(function() {
                        // Link to User
                        agent.post('/courses/user/'+ courseObj._id)
                            .expect(200)
                            .end(function(err, res){
                                res.body.should.be.an.Object.with.property('name', course.name);
                                done();
                            });
				    });
			});
	});

	it('should be able to access courses in user profile if logged in', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);
                    // Add Course
				    var courseObj = new Course(course);
                    courseObj.save(function() {
                        // Link to User
                        agent.post('/courses/user/'+ courseObj._id)
                            .expect(200)
                            .end(function(err, res){
                                res.body.should.be.an.Object.with.property('name', course.name);
                                // Get courses in user profile
                                agent.get('/courses/user/')
                                    .expect(200)
                                    .end(function(err,res){
                                        if(err) done(err);
                                        res.body.should.be.an.Object.with.lengthOf(1);
                                        if(res.body == courseObj._id.toString()){
                                            done();
                                        }
                                    });
                            });
				    });
			});
	});

	it('should give error if trying to access courses in user profile while not logged in', function(done) {
        // Add Course
		var courseObj = new Course(course);
        courseObj.save(function() {
            // Link to User
            agent.get('/courses/user/')
                .expect(401, done())
			});
	});

	it('should give error if trying to add course to user while not logged in ', function(done) {
        // Add Course
		var courseObj = new Course(course);
        courseObj.save(function() {
            // Link to User
            agent.post('/courses/user/'+ courseObj._id)
                .expect(401, done())
			});
	});

	it('should give error if user is logged in and course school does not matches user school', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);
                    // Add Course
				    var courseObj = new Course(course);
				    courseObj.school = school2._id; // change course school Id
                    courseObj.save(function() {
                        // Link to User
                        agent.post('/courses/user/'+ courseObj._id)
                            .expect(403)
                            .end(function(err, res){
                                (res.body.message).should.match('Course school id does not match user school id');
                                done();
                            });
				    });
			});
	});

	it('should be able to remove a course from user if logged in', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);
                    // Add Course
				    var courseObj = new Course(course);
                    courseObj.save(function() {
                        // Link to User
                        agent.post('/courses/user/'+ courseObj._id)
                            .expect(200)
                            .end(function(err, res){
                                res.body.should.be.an.Object.with.property('name', course.name);

                                agent.delete('/courses/user/'+ courseObj._id)
                                    .end(function(err,res){
                                    // Get courses in user profile
                                        agent.get('/courses/user/')
                                            .expect(200)
                                            .end(function(err,res){
                                                if(err) done(err);
                                                res.body.should.be.an.Object.with.lengthOf(0);
                                                done();
                                            });
                                    })
                            });
				    });
			});
	});

    it('should give error if trying to remove a course not logged in', function(done) {
        // Add Course
		var courseObj = new Course(course);
        courseObj.save(function() {
            // Link to User
            agent.delete('/courses/user/'+ courseObj._id)
                .expect(401)
                .end(function(err,res){
                    (res.body.message).should.match('User is not logged in');
                    done();
                });
			});
	});

	afterEach(function(done) {
		User.remove().exec();
		School.remove().exec();
		Course.remove().exec();
		done();
	});
});
