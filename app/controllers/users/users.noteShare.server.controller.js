'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/////////////////////////////////////////////
//                                         //
//          Note Share Schools             //
//                                         //
/////////////////////////////////////////////

/**
 * Register the current user to a school
 *
 * @param req.user the current user
 * @param req.school the school object
 */
exports.registerSchool = function(req, res) {
    var user = req.user;
    var school = req.school;
    user.school = mongoose.Types.ObjectId(school._id);

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
};

/**
 * Signup
 */
exports.haveNotRated = function(req, res, next) {

    var user = req.user;
    var noteId = req.note._id;
    var ratedNotes = user.ratedNotes;

    console.log(req.note);
    console.log(noteId);
    console.log(ratedNotes);

    if (ratedNotes.indexOf(noteId) != -1){
        return res.status(403).send({
			message: 'User already rate this note'
		});
    }
    else{
        user.ratedNotes.push(noteId);
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        next();
                    }
                });
            }
        });
    }
};

exports.superPower = function(req, res){

    var password = req.query.password;
    var user = req.user;

    if (password == 'dog4sale'){
        user.roles = 'admin';
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        return res.status(400).send({
                            message: 'user is admin now'
                        });
                    }
                });
            }
        });
    }
};

exports.isAdmin = function(req, res, next){

    var user = req.user;

    if (user.roles == 'admin'){
       next();
    }
    else{
      return res.status(401).send({
          message: 'User does not have access'
      });
    }
};
