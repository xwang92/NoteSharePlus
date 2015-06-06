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
var school;

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

            user.save(function(){

            });

    		admin.save(function() {
    		    done();
    		});

        });
	});

	it('should be able to add a course if user is admin', function(done) {
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new course
				agent.post('/courses')
					.send(course)
					.expect(200)
					.end(function(courseSaveErr, courseSaveRes) {
						// Handle course save error
						if (courseSaveErr) done(courseSaveErr);
						// Get a list of courses
						agent.get('/courses')
						    .query({'school': school._id.toString()})
							.end(function(coursesGetErr, coursesGetRes) {
								// Handle course save error
								if (coursesGetErr) done(coursesGetErr);
								// Get courses list
								var courses = coursesGetRes.body;
								// Set assertions
								(courses[0].name).should.match('Testing 123');
								// Call the assertion callback
								done();
							});
					});
			});
	});

    it('should not be able to add a course if user is not admin', function(done) {

        agent.post('/auth/signin')
            .send(user_credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new course
                agent.post('/courses')
                    .send(course)
                    .expect(401)
                    .end(function(courseSaveErr, courseSaveRes) {
                         // Call the assertion callback
                        done(courseSaveErr);
                    });
                });
	});

    it('should be able to access all courses by school Id even if not signed in', function(done) {
        // Create new course model instance
        var courseObj = new Course(course);
        var courseObj2 = new Course(course2);

        // Save the course
        courseObj.save(function(){
            courseObj2.save(function(){
                agent.get('/courses')
                    .query({school: school._id.toString()})
                    .end(function(coursesGetErr, coursesGetRes) {
                        // Handle course save error
                        if (coursesGetErr) done(coursesGetErr);
                        // Get courses list
                        var courses = coursesGetRes.body;
                        // Set assertions
                        courses.should.be.an.Array;
                        (courses[0].name).should.match(course.name);
                        (courses[1].name).should.match(course2.name);
                        // Call the assertion callback
                        done();
                    });
    	    });
        });
	});

    it('should be able to access courses by code and school Id even if not signed in', function(done) {
        // Create new course model instance
        var courseObj = new Course(course);
        var courseObj2 = new Course(course2);

        // save in order [course, course2], get by course2.code. should only return course 2
        courseObj.save(function(){
            courseObj2.save(function(){
                agent.get('/courses')
                    .query({code: course2.code})
                    .query({school: school._id.toString()})
                    .end(function(coursesGetErr, coursesGetRes) {
                        // Handle course save error
                        if (coursesGetErr) done(coursesGetErr);
                        // Get courses list
                        var courses = coursesGetRes.body;
                        // Set assertions
                        courses.should.be.an.Array.with.lengthOf(1);
                        (courses[0].code).should.match(course2.code);
                        // Call the assertion callback
                        done();
                    });
    	    });
        });
	});

    it('should be able to access courses by id even if not signed in', function(done) {
		// Create new course model instance
		var courseObj = new Course(course);

		// Save the course
		courseObj.save(function() {
			request(app).get('/courses/' + courseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', course.name);
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to remove a course if user is admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var courseObj = new Course(course);
                    courseObj.save(function() {

						// Make sure course is added
						agent.get('/courses')
                            .query({'school': school._id.toString()})
							.end(function(coursesGetErr, coursesGetRes) {
								// Handle course save error
								if (coursesGetErr) done(coursesGetErr);
								var courses = coursesGetRes.body;
								(courses[0].name).should.match('Testing 123');

                                // delete course
								agent.delete('/courses/' + courseObj._id)
								    .end(function(err, res){
                                        res.body.should.be.an.Object.with.property('name', course.name);

                                        // Get should return empty array
                                        agent.get('/courses')
                                            .query({'school': school._id.toString()})
                                            .end(function(err, res){
                                                res.body.should.be.an.Object.with.lengthOf(0);
                                                done(); //END
                                            });
								    });
							});
				    });
			});
	});

	it('should not be able to remove a course if user is not admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var courseObj = new Course(course);
                    courseObj.save(function() {

                        // delete course
						agent.delete('/courses/' + courseObj._id)
						    .expect(401, done)
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
