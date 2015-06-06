'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School'),
	Course = mongoose.model('Course'),
	Note = mongoose.model('Note'),
	agent = request.agent(app);

/**
 * Globals
 */
var admin_credentials, admin, note, note2;
var user_credentials, user, section;
var school, course;

/**
 * Note routes tests
 */
describe('Note CRUD tests', function() {
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
                // Create note
                section = new Note({
                    year: '2015',
                    term: 'Fall',
                    note: 'LEC0104',
                    course: course._id
                });

                section.save(function(){

                    note = new Note({
                        name: 'notes',
                        noteType: 'Lecture',
                        fileType: 'Image',
                        date: '2015/09/03',
                        author: user._id,
                        section: section._id
                    });

                    note2 = new Note({
                        name: 'notes',
                        noteType: 'Lecture',
                        fileType: 'Image',
                        date: '2015/09/03',
                        author: user._id,
                        section: section._id
                    });

                    done();
                });
            })
        });
	});

	it('should be able to add a note if user is admin', function(done) {
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new note
				agent.post('/notes')
					.send(note)
					.expect(200)
					.end(function(noteSaveErr, noteSaveRes) {
						// Handle note save error
						if (noteSaveErr) done(noteSaveErr);
						// Get a list of notes
						agent.get('/notes')
						    .query({'course': course._id.toString()})
							.end(function(notesGetErr, notesGetRes) {
								// Handle note save error
								if (notesGetErr) done(notesGetErr);
								// Get notes list
								var notes = notesGetRes.body;
								(notes[0].year).should.match(note.year);
                                (notes[0].term).should.match(note.term);
                                (notes[0].note).should.match(note.note);
								done();
							});
					});
			});
	});

    it('should not be able to add a note if user is not admin', function(done) {

        agent.post('/auth/signin')
            .send(user_credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new note
                agent.post('/notes')
                    .send(note)
                    .expect(401)
                    .end(function(noteSaveErr, noteSaveRes) {
                         // Call the assertion callback
                        done(noteSaveErr);
                    });
                });
	});

    it('should be able to access all note under a course by course Id even if not signed in', function(done) {
        // Create new note model instance
        var noteObj = new Note(note);
        var noteObj2 = new Note(note2);

        // Save the note
        noteObj.save(function(){
            noteObj2.save(function(){
                agent.get('/notes')
                    .query({course: course._id.toString()})
                    .end(function(notesGetErr, notesGetRes) {
                        // Handle note save error
                        if (notesGetErr) done(notesGetErr);
                        // Get notes list
                        var notes = notesGetRes.body;
                        // Set assertions
                        notes.should.be.an.Array.with.lengthOf(2);
                        (notes[0].year).should.match(note.year);
                        (notes[0].term).should.match(note.term);
                        (notes[0].note).should.match(note.note);
                        (notes[1].year).should.match(note2.year);
                        (notes[1].term).should.match(note2.term);
                        (notes[1].note).should.match(note2.note);
                        // Call the assertion callback
                        done();
                    });
    	    });
        });
	});

    it('should give error if trying to access notes without a course Id', function(done) {
        // Create new note model instance
        var noteObj = new Note(note);
        var noteObj2 = new Note(note2);

        // Save the note
        noteObj.save(function(){
            noteObj2.save(function(){
                agent.get('/notes')
                    .expect(400)
                    .end(function(err,res){
                        (res.body.message).should.match('Need a valid course Id to get notes under a course');
                        done();
                    });
    	    });
        });
	});

	it('should be able to access notes by id even if not signed in', function(done) {
		// Create new note model instance
		var noteObj = new Note(note);

		// Save the note
		noteObj.save(function() {
			request(app).get('/notes/' + noteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('year', note.year);
					res.body.should.be.an.Object.with.property('term', note.term);
					res.body.should.be.an.Object.with.property('note', note.note);
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to remove a note if user is admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(admin_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var noteObj = new Note(note);
                    noteObj.save(function() {

						// Make sure note is added
						agent.get('/notes')
                            .query({'course': course._id.toString()})
							.end(function(notesGetErr, notesGetRes) {
								// Handle note save error
								if (notesGetErr) done(notesGetErr);
								var notes = notesGetRes.body;
								(notes[0].year).should.match(note.year);
								(notes[0].term).should.match(note.term);
								(notes[0].note).should.match(note.note);
                                // delete note
								agent.delete('/notes/' + noteObj._id)
								    .end(function(err, res){
                                        res.body.should.be.an.Object.with.property('year', note.year);
                                        res.body.should.be.an.Object.with.property('term', note.term);
                                        res.body.should.be.an.Object.with.property('note', note.note);

                                        // Get should return empty array
                                        agent.get('/notes')
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

	it('should not be able to remove a note if user is not admin', function(done) {
	    // Login
		agent.post('/auth/signin')
			.send(user_credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) done(signinErr);

				    var noteObj = new Note(note);
                    noteObj.save(function() {

                        // delete note
						agent.delete('/notes/' + noteObj._id)
						    .expect(401, done)
				    });
			});
	});

	afterEach(function(done) {
		User.remove().exec();
		School.remove().exec();
		Note.remove().exec();
		done();
	});
});
