/**
 * Created by bangbang93 on 14-9-15.
 */
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);


var Department = new mongoose.Schema({
    did: Number,
    name: String,
    location: String
});

var Club = new mongoose.Schema({
    cid: Number,
    name: String,
    logo: String,
    departments: [Department],  //Department
    interviewer: [String],
    password: String,
    maxDep: Number //应试者最多可以选择的部门
});


var rate = new mongoose.Schema({
    did: Number,
    score: Number,
    comment: String,
    interviewer: String
});

var Interviewee = new mongoose.Schema({
    sid: Number,
    cid: Number,
    name: {
        type:String,
        default: ''
    },
    sex: {
        type: Number,
        default: 2   //0女1男2秀吉
    },
    major: {
        type:String,
        default: ''
    },
    phone: {
        type:String,
        default: ''
    },
    email: {
        type:String,
        default: ''
    },
    qq: {
        type:String,
        default: ''
    },
    volunteer: [Number],
    notion: {
        type:String,
        default: ''
    },
    signTime: Date,
    rate: [rate],//{did: Number,score: Number, comment: String, interviewer: String}
    done: [Number],
    extra: {
        type: Object,
        default: {}
    },
    busy: {
        type: Boolean,
        default: false
    }   //是否正在面试
});

exports.Interviewee = mongoose.model('interviewee', Interviewee);
exports.Club = mongoose.model('club', Club);