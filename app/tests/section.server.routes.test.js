'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course'),
	Section = mongoose.model('Section'),
	agent = request.agent(app);

/**
 * Globals
 */
var admin_credentials, admin, section, section2;
var user_credentials, user;
var school, course;

/**
 * Section routes tests
 */
describe('Section CRUD tests', function() {
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
        // Create and save school
        school.save(function(){

            // Create user and admin
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

            course = new Course({
    		    name: 'Testing 123',
    			code: 'TES123',
    			school: school._id
    		});

            user.save();
    		admin.save();
            // Create and save courses
            course.save(function(){
                // Create section
                section = new Section({
                    year: '2015',
                    term: 'Fall',
                    section: 'LEC0104',
                    course: course._id
                });
                section2 = new Section({
                    year: '3456',
                    term: 'Winter',
                    section: 'LEC9999',
                    course: course._id
                });

                done();
            })
        });
	});

	it('should be able to add a section if user is admin', function(done) {
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new section
				agent.post('/sections')
					.send(section)
					.expect(200)
					.end(function(sectionSaveErr, sectionSaveRes) {
						// Handle section save error
						if (sectionSaveErr) done(sectionSaveErr);
						// Get a list of sections
						agent.get('/sections')
						    .query({'course': course._id.toString()})
							.end(function(sectionsGetErr, sectionsGetRes) {
								// Handle section save error
								if (sectionsGetErr) done(sectionsGetErr);
								// Get sections list
								var sections = sectionsGetRes.body;
								(sections[0].year).should.match(section.year);
                                (sections[0].term).should.match(section.term);
                                (sections[0].section).should.match(section.section);
								done();
							});
					});
			});
	});

    it('should not be able to add a section if user is not admin', function(done) {

        agent.post('/auth/signin')
            .send(user_credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new section
                agent.post('/sections')
                    .send(section)
                    .expect(401)
                    .end(function(sectionSaveErr, sectionSaveRes) {
                         // Call the assertion callback
                        done(sectionSaveErr);
                    });
                });
	});

    it('should be able to access all section under a course by course Id even if not signed in', function(done) {
        // Create new section model instance
        var sectionObj = new Section(section);
        var sectionObj2 = new Section(section2);

        // Save the section
        sectionObj.save(function(){
            sectionObj2.save(function(){
                agent.get('/sections')
                    .query({course: course._id.toString()})
                    .end(function(sectionsGetErr, sectionsGetRes) {
                        // Handle section save error
                        if (sectionsGetErr) done(sectionsGetErr);
                        // Get sections list
                        var sections = sectionsGetRes.body;
                        // Set assertions
                        sections.should.be.an.Array.with.lengthOf(2);
                        (sections[0].year).should.match(section.year);
                        (sections[0].term).should.match(section.term);
                        (sections[0].section).should.match(section.section);
                        (sections[1].year).should.match(section2.year);
                        (sections[1].term).should.match(section2.term);
                        (sections[1].section).should.match(section2.section);
                        // Call the assertion callback
                        done();
                    });
    	    });
        });
	});

    it('should give error if trying to access sections without a course Id', function(done) {
        // Create new section model instance
        var sectionObj = new Section(section);
        var sectionObj2 = new Section(section2);

        // Save the section
        sectionObj.save(function(){
            sectionObj2.save(function(){
                agent.get('/sections')
                    .expect(400)
                    .end(function(err,res){
                        (res.body.message).should.match('Need a valid course Id to get sections under a course');
                        done();
                    });
    	    });
        });
	});

	it('should be able to access sections by id even if not signed in', function(done) {
		// Create new section model instance
		var sectionObj = new Section(section);

		// Save the section
		sectionObj.save(function() {
			request(app).get('/sections/' + sectionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('year', section.year);
					res.body.should.be.an.Object.with.property('term', section.term);
					res.body.should.be.an.Object.with.property('section', section.section);
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to remove a section if user is admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var sectionObj = new Section(section);
                    sectionObj.save(function() {

						// Make sure section is added
						agent.get('/sections')
                            .query({'course': course._id.toString()})
							.end(function(sectionsGetErr, sectionsGetRes) {
								// Handle section save error
								if (sectionsGetErr) done(sectionsGetErr);
								var sections = sectionsGetRes.body;
								(sections[0].year).should.match(section.year);
								(sections[0].term).should.match(section.term);
								(sections[0].section).should.match(section.section);
                                // delete section
								agent.delete('/sections/' + sectionObj._id)
								    .end(function(err, res){
                                        res.body.should.be.an.Object.with.property('year', section.year);
                                        res.body.should.be.an.Object.with.property('term', section.term);
                                        res.body.should.be.an.Object.with.property('section', section.section);

                                        // Get should return empty array
                                        agent.get('/sections')
                                            .query({'course': course._id.toString()})
                                            .end(function(err, res){
                                                res.body.should.be.an.Object.with.lengthOf(0);
                                                done(); //END
                                            });
								    });
							});
				    });
			});
	});

	it('should not be able to remove a section if user is not admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var sectionObj = new Section(section);
                    sectionObj.save(function() {

                        // delete section
						agent.delete('/sections/' + sectionObj._id)
						    .expect(401, done)
				    });
			});
	});

	afterEach(function(done) {
		User.remove().exec();
		School.remove().exec();
		Section.remove().exec();
		done();
	});
});
