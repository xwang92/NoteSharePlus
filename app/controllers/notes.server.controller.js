'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    mongoose = require('mongoose'),
    gm = require('gm'),
    fs = require('fs'),
    courses = require('../../app/controllers/courses.server.controller'),
    Course = mongoose.model('Course'),
    School = mongoose.model('School'),
    Section = mongoose.model('Section'),
    Note = mongoose.model('Note');

/**
 * Get notes by user id, if available. If not, go to the next method.
 *
 * @param req.query.author the ID of an user, requested by the user
 */
exports.fromUser = function(req, res, next) {

    if (req.query.author) {

        var authorId = req.query.author;
        var query = {};
        console.log("author ID: " + authorId);
        query.author = mongoose.Types.ObjectId(authorId);

        Note.find(query).populate('author').populate('course').exec(function(err, note) {
            if (err) return next(err);
            if (!note) return next(new Error('Failed to load note with id ' + authorId));
            res.json(note);
        });
    } else {
        next();
    }
};

/**
 * Get notes by course id, if available. If not, go to the next method.
 *
 * @param req.user.course the ID of a course, requested by the user
 */
exports.fromSection = function(req, res, next) {

    if (req.query.section) {

        var sectionId = req.query.section;
        var query = {};
        console.log("section ID: " + sectionId);
        query.section = mongoose.Types.ObjectId(sectionId);

        Note.find(query).populate('section').populate('author').exec(function(err, note) {
            if (err) return next(err);
            if (!note) return next(new Error('Failed to load note with id ' + sectionId));
            res.json(note);
        });
    } else {
        next();
    }
};

/**
 * Get all notes with given tag, if available. If not specified, then returns all of the
 * current user's notes. If it does not exist, send back an error.
 *
 * @param req.query.tag the string tag representation.
 */
exports.fromTag = function(req, res, next) {
    var givenTag = req.query.tag;
    var query = {};
    console.log("tag: " +givenTag);
    query.tags = givenTag;
    if (givenTag) {
        Note.find(query).populate('author').populate('course').exec(function(err, note) {
            if (err) return next(err);
            if (!note) return next(new Error('Failed to load notes with tag ' + givenTag));
            res.json(note);
        });
    } else {
        var defaultUser = {};
        defaultUser.author = mongoose.Types.ObjectId(req.user._id);
        Note.find(defaultUser).populate('author').populate('course').exec(function(err, note) {
            if (err) return next(err);
            if (!note) return next(new Error('Failed to load note with id ' + req.user));
            res.json(note);
        });
    }
};

/**
 * Get a note from the given note id
 *
 * @param req.note the note object
 */
exports.read = function(req, res) {
    res.json(req.note);
};

exports.create = function(req, res) {

    var note = new Note(req.body);
    note.author = req.user._id;

    console.log(note);

    Section.findById(note.section).exec(function(err, section) {
        if (err) return res.status(400).send();
        if (!section) return res.status(400).send({
            message: 'section not found'
        });
    });

    note.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Section.findById(note.section).exec(function(err, section) {
                if (err) return res.status(400).send();
                if (!section) return res.status(400).send({
                    message: 'section not found'
                });
                section.notes.push(note);
                section.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.json(note);
                    }
                });
            });
        }
    });
};

exports.getImage = function(req, res){

    var note = req.note;

    if ( req.query.number ){
        var filePath = req.note.location[parseInt(req.query.number)];
        var rootDir = __dirname;
        rootDir = rootDir.substring(0,rootDir.indexOf('app'));
        return res.sendFile(filePath, {root: rootDir});
    }
    else{
        return res.json({
            count: note.location.length
        });
    }
};

exports.getDoc = function(req, res){

    Note.findById(req.note).exec(function(err, note) {
        if (err) return res.status(400).send();
        if (!note) return res.status(400).send({
            message: 'note not found'
        });

        if( req.note.location.length > 0 ){
            var filePath = req.note.location.shift();
            return res.sendFile(filePath);
        }
        else{
            return res.status(400).send({
                message: 'Empty'
            });
        }
    });

};

exports.addDocToNote = function(req, res){

    findAllID(req, res, function(school,course,section,note){

        var schoolName = school.name.replace(/\W/g, '');
        var courseCode = course.code.replace(/\W/g, '');
        var path = getFullPath('./uploads/' , schoolName, courseCode , section);
        var filePath = path + '/' + req.files.file.name;

        console.log(req.files);

        // check image extension matches accepted list
        var error = matchDocExtension(req.files.file.extension, req.files.file.path);
        if(error){
             return res.status(400).send({
                 message: 'Document type is not accepted'
             });
        }
        // move file from tmp to file path
        moveFile( req.files.file, filePath, res);
        // push location into note document
        note.location.push(filePath);

        console.log(note);

        note.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.json(note);
            }
        });
    });
};

/**
 * Create a new note
 * @param req.user the current user. Requires log in
 *
 * Uploaded notes will be store at ./uploads/tmp
 * Notes will then be placed in a file path format of:  ./uploads/"school name"/"course code"/"image name"
 *
 *  req NEEDS TO CONTAIN:   file: xxxxxx.xxx <- the actual image
                            type: lecture/tutorial/homework
                            number: 1 (ex: lecture 1/ tutorial 1 / homework)
 *                          sectionId: xxxxx
 *
 */
exports.addImageToNote = function(req, res) {

    //console.log('in add image');
    //console.log(req.user._id);

    findAllID(req, res, function(school,course,section,note){

        console.log(school,course,section,note);

        var schoolName = school.name.replace(/\W/g, '');
        var courseCode = course.code.replace(/\W/g, '');
        var path = getFullPath('./uploads/' , schoolName, courseCode , section);
        var filePath = path + '/' + req.files.file.name;
        var thumbNailPath = path + '/thumbnail_' + req.files.file.name;

        //console.log(req.files);
        //console.log(filePath,thumbNailPath);

        // check image extension matches accepted list
        var error = matchImgExtension(req.files.file.extension, req.files.file.path);
        if(error){
             return res.status(400).send({
                 message: 'image type is not accepted'
             });
        }
        // move from tmp to file path, resize and create thumbnail
        moveFile_Resize_CreateThumbnail( req.files.file, filePath, thumbNailPath, res);
        // push image and thumbnail
        note.location.push(filePath);
        note.thumbNail.push(thumbNailPath);

        //console.log(note);

        note.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.json(note);
            }
        });
    });
};

function findAllID(req, res, callback) {

    Note.findById(req.note).exec(function(err, note) {
        if (err) return res.status(400).send();
        if (!note) return res.status(400).send({
            message: 'note not found'
        });

        Section.findById(note.section).exec(function(err, section) {
            if (err) return res.status(400).send();
            if (!section) return res.status(400).send({
                message: 'section not found'
            });

            Course.findById(section.course).exec(function(err, course) {
                if (err) return res.status(400).send();
                if (!course) return res.status(400).send({
                    message: 'course not found'
                });

                School.findById(course.school).exec(function(err, school) {
                        if (err) return res.status(400).send();
                        if (!school) return res.status(400).send({
                            message: 'school not found'
                        });

                        callback(school,course,section,note);
                });
            });
        });
    });
};

/*   Create path to note if the complete path does not exist yet
 *   prefix by default will be './uploads/'
 *   Create schoolName folder and courseCode folder if they don't already exist
 */
function getFullPath( prefix, schoolName, courseCode, section){

    var schoolPath = prefix + schoolName;
    var coursePath = schoolPath + '/' + courseCode;
    var sectionYear = coursePath + '/' + section.year;
    var sectionTerm = sectionYear + '/' + section.term;
    var sectionFullPath = sectionTerm + '/' + section.section;

    if (!fs.existsSync(schoolPath)){
        fs.mkdirSync(schoolPath);
    }
    if (!fs.existsSync(coursePath)){
        fs.mkdirSync(coursePath);
    }
    if (!fs.existsSync(sectionYear)){
        fs.mkdirSync(sectionYear);
    }
    if (!fs.existsSync(sectionTerm)){
        fs.mkdirSync(sectionTerm);
    }
    if (!fs.existsSync(sectionFullPath)){
        fs.mkdirSync(sectionFullPath);
    }

    return sectionFullPath;
};


function matchDocExtension(extension, filePath){
    var acceptedExtensions = ['pdf','doc','docx','txt','wps','wpd','rtf','ppt','pps','pptx','xls','xlsx','xlr','tar','csv'];
    if ( acceptedExtensions.indexOf(extension) <= -1 ){
        fs.unlink(filePath);
        return true;
    }
};

// These are the accepted image extensions
function matchImgExtension(extension, filePath){
    var acceptedExtensions = ['tif','tiff','jpeg','jpg','jif','jfif','jp2','jpx','j2k','j2c','fpx','pcd','png','pdf'];
    if ( acceptedExtensions.indexOf(extension) <= -1 ){
        fs.unlink(filePath);
        return true;
    }
};

function moveFile(file, filePath, res){
    var defaultPath = file.path;
    fs.rename(defaultPath, filePath, function(err){
        if (err) res.json(err);
    });
};

function moveFile_Resize_CreateThumbnail( file, filePath, thumbNailPath, res ){
    var defaultPath = file.path;
    fs.rename(defaultPath, filePath, function(err){
        if (err) res.json(err);
        if(file.size > 524288)
            resizeNote(filePath);
        create_thumbNail(filePath, thumbNailPath);
    });
};

function resizeNote(filePath){
    gm(filePath)
    .resize(720, 720)
    .noProfile()
    .write(filePath, function (err) {
        if (!err) console.log('done resizing');
    });
}

function create_thumbNail(filePath, thumbNailPath){
    gm(filePath)
    .resize(160, 160)
    .noProfile()
    .write(thumbNailPath, function (err) {
        if (!err) console.log('done thumbnail');
    });
}
/**
 * Update a note (overwrites fields)
 *
 * @param req.note the note object
 */
exports.update = function(req, res) {
    var note = req.note;

    note = _.extend(note, req.body);

    note.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });
};

/**
 * Delete a note
 *
 * @param req.note the note object to remove
 */
exports.delete = function(req, res) {
    var note = req.note;

    note.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });
};

/**
 * Removes tags from the given note
 *
 * @param req.note the note object  to modify
 */
exports.removeTags = function(req, res) {
    var note = req.note;
    var newTags = req.body.tags;
    newTags = _.difference(note.tags, [newTags]);
    note.tags = newTags;

    note.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });

};

/**
 * Adds tags to the given note
 *
 * @param req.note the note object to modify
 */
exports.addTags = function(req, res) {
    var note = req.note;
    var newTags = req.body.tags;
    newTags = _.union( [newTags] , note.tags );
    note.tags = newTags;

    note.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });
};

/**
 * Note authorization middleware; ensures that the user has the appropriate
 * authorization to access the note
 *
 * @param req.note the note object the user is authorizing against
 * @param req.user the current user
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.note.author.id !== req.user.id) {
        return res.status(413).send({
            message: 'User is not authorized'
        });
    }
    next();
};

/**
 * Note middleware
 */
exports.noteById = function(req, res, next, id) {
    Note.findById(id).exec(function(err, note) {
        if (err) return next(err);
        if (!note) return next(new Error('Failed to load note ' + id));
        req.note = note;
        next();
    });
};

exports.delete = function(req , res ){

    var note = req.note;

    note.remove(function(err) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(note);
		}
    });

};

exports.findAll= function( req, res ){

    Note.find().exec(function(err, note) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });

};

exports.addRating = function(req, res){

    var note = req.note;
    console.log("OLD rating: " + note.rating + " ratingCount: " + note.ratingCount)
    var ratingCount = parseInt(note.ratingCount);
    var rating = parseFloat(note.rating);
    rating = ( (rating * ratingCount) + parseInt(req.body.rating) ) / (ratingCount + 1);

    note.rating = String(rating)
    note.ratingCount = String(ratingCount + 1);

    console.log("NEW rating: " + note.rating + " ratingCount: " + note.ratingCount)

    note.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(note);
        }
    });
};


exports.hasAuthorization = function(req, res, next){

    findAllID(req, res, function(school,course,section,note){

        var user = req.user;
        var schoolId = String(school._id);
        var userSchoolId = String(user.school);

        console.log(schoolId);
        console.log(userSchoolId);
        if( schoolId  == userSchoolId ){
            next();
        }
        else{
            return res.status(401).send({
                message:'school does not match user profile'
            });
        }
    });
};
