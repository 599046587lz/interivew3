/**
 * Created by bangbang93 on 14-9-15.
 */
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);

var Schema = mongoose.Schema;

var Department = new Schema({
    did: Number,
    name: String,
    location: String
});

var Club = new Schema({
    cid: Number,
    name: String,
    logo: String,
    departments: [Department],  //Department
    interviewer: [String],
    password: String,
    maxDep: Number //应试者最多可以选择的部门
});

exports.Club = mongoose.model('club', Club);

var rate = new Schema({
    did: Number,
    score: Number,
    comment: String,
    interviewer: String
});

var Interviewee = new Schema({
    sid: Number,
    cid: Number,
    name: String,
    sex: Boolean,   //false gay;true girl
    major: String,
    phone: String,
    email: String,
    qq: String,
    volunteer: [Number],
    notion: String,
    signTime: Date,
    rate: [rate],//{did: Number,score: Number, comment: String, interviewer: String}
    done: [Number],
    extra: Object,
    busy: Boolean   //是否正在面试
});

exports.Interviewee = mongoose.model('interviewee', Interviewee);