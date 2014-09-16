/**
 * Created by bangbang93 on 14-9-15.
 */
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);

var Schema = mongoose.Schema;

//exports.Department = new Schema({
//    did: Number,
//    name: String,
//    location: String
//});

exports.Club = new Schema({
    cid: Number,
    name: String,
    logo: Buffer,
    departments: [Object],  //Department
    interviewer: [String],
    password: String,
    maxDep: Number //应试者最多可以选择的部门
});

exports.Interviewee = new Schema({
    sid: Number,
    name: String,
    sex: Boolean,
    major: String,
    phone: String,
    email: String,
    qq: String,
    volunteer: [Number],
    message: String,
    signTime: Date,
    rate: Object,//{did:{score: Number, comment: String, interviewer: String}}
    done: [Number],
    extra: Object
});