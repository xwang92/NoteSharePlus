'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	agent = request.agent(app);

/**
 * Globals
 */
var admin_credentials, admin, school;
var user_credentials, user, school2;

/**
 * School routes tests
 */
describe('School CRUD tests', function() {
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

		// Create a new user
		admin = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			roles: 'admin',
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
			username: user_credentials.username,
			password: user_credentials.password,
			provider: 'local'
		});

        user.save(function(){

        });

		// Save a user to the test db and create new school
		admin.save(function() {
			school = {
				name: 'University of Testing',
				domain: 'test.com'
			};

            school2 = {
				name: 'University of Texas',
				domain: 'texas.com'
			};

			done();
		});
	});

	it('should be able to add a school if user is admin', function(done) {
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new school
				agent.post('/schools')
					.send(school)
					.expect(200)
					.end(function(schoolSaveErr, schoolSaveRes) {
						// Handle school save error
						if (schoolSaveErr) done(schoolSaveErr);

						// Get a list of schools
						agent.get('/schools')
							.end(function(schoolsGetErr, schoolsGetRes) {
								// Handle school save error
								if (schoolsGetErr) done(schoolsGetErr);

								// Get schools list
								var schools = schoolsGetRes.body;

								// Set assertions
								(schools[0].name).should.match('University of Testing');

								// Call the assertion callback
								done();
							});
					});
			});
	});

    it('should not be able to add a school if user is not admin', function(done) {

        agent.post('/auth/signin')
            .send(user_credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new school
                agent.post('/schools')
                    .send(school)
                    .expect(401)
                    .end(function(schoolSaveErr, schoolSaveRes) {
                         // Call the assertion callback
                        done(schoolSaveErr);
                    });
                });
	});

    it('should be able to access all schools even if not signed in', function(done) {
        // Create new school model instance
        var schoolObj = new School(school);

        // Save the school
        schoolObj.save(function(){
            agent.get('/schools')
    			.end(function(schoolsGetErr, schoolsGetRes) {
    				// Handle school save error
    				if (schoolsGetErr) done(schoolsGetErr);

    				// Get schools list
    				var schools = schoolsGetRes.body;

    				// Set assertions
    				schools.should.be.an.Array;
    				(schools[0].name).should.match('University of Testing');

    				// Call the assertion callback
    				done();
    			});
        });

	});

    it('should be able to access schools by name even if not signed in', function(done) {
        // Create new school model instance
        var schoolObj = new School(school);
        var schoolObj2 = new School(school2);

        // Save the school
        schoolObj2.save(function(){
            schoolObj.save(function(){

                agent.get('/schools')
                    .query({ name: 'University of Testing' })
                    .end(function(schoolsGetErr, schoolsGetRes) {
                        // Handle school save error
                        if (schoolsGetErr) done(schoolsGetErr);

                        // Get schools list
                        var schools = schoolsGetRes.body;

                        // Set assertions
                        schools.should.be.an.Array.with.lengthOf(1);
                        (schools[0].name).should.match('University of Testing');

                        // Call the assertion callback
                        done();
                    });

            });
        });
	});

    it('should be able to access schools by id even if not signed in', function(done) {
		// Create new school model instance
		var schoolObj = new School(school);

		// Save the school
		schoolObj.save(function() {
			request(app).get('/schools/' + schoolObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', school.name);

					// Call the assertion callback
					done();
				});
		});
	});

    it('should not be able to add a school to user profile if not logged in', function(done) {
		// Create new school model instance
		var schoolObj = new School(school);

		// Save the school
		schoolObj.save(function() {
			agent.put('/schools/' + schoolObj._id)
			    .expect(401, done());
		});
	});

    it('should not be able to add a school to user profile if email domain does not match', function(done) {
        // Create new school model instance
        school.domain = 'something.com'
		var schoolObj = new School(school);
		//var schoolId = mongoose.Types.ObjectId(schoolObj._id);

		// Save the school
		schoolObj.save(function() {

	        agent.post('/auth/signin')
    			.send(user_credentials)
    			.expect(200)
    			.end(function(signinErr, signinRes) {
    				// Handle signin error
    				if (signinErr) done(signinErr);

    				// Save a new school
    				agent.put('/schools/'+ schoolObj._id )
    					.send(school)
    					.expect(403, done)
    			});
		});
	});

    it('should be able to add a school to user profile if logged in and e-mail domain match', function(done) {
        // Create new school model instance
		var schoolObj = new School(school);

		// Save the school
		schoolObj.save(function() {

	        agent.post('/auth/signin')
    			.send(user_credentials)
    			.expect(200)
    			.end(function(signinErr, signinRes) {
    				// Handle signin error
    				if (signinErr) done(signinErr);

    				// Save a new school
    				agent.put('/schools/'+ schoolObj._id )
    					.send(school)
    					.expect(200)
    					.end(function(err, res) {
    						// Handle school save error
    						if (err) done(err);
                            res.body.should.be.an.Object.with.property('school', schoolObj._id );

    					});
    			});
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		School.remove().exec();
		done();
	});
});
