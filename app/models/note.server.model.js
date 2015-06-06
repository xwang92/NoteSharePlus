'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NoteSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'number cannot cannot be blank'
    },
    noteType:{
		type: String,
		enum: ['Lecture', 'Tutorial', 'HomeWork', 'Exam', 'Other'],
		required: 'note type cannot be blank'
    },
    fileType: {
		type: String,
		enum: ['Image', 'Doc'],
        required: 'file type cannot be blank'
    },
    number: {
        type: String
    },
    date:{
        type: Date,
        required: 'date cannot be blank'
    },
    rating: {
        type: String,
        default: '0'
    },
    ratingCount:{
        type: String,
        default: '0'
    },
    location: [{
        type: String,
        trim: true
    }],
    thumbNail: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Note needs an author'
    },
    section: {
        type: Schema.ObjectId,
        ref: 'Section',
        required: 'Section cannot be blank'
    }
});

NoteSchema.index({noteType: 1, date: 1, name: 1}, {unique: true});

mongoose.model('Note', NoteSchema);
