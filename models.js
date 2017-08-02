/**
 * Created by bangbang93 on 14-9-15.
 */
let mongoose = require('mongoose');
let config = require('./config');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db,{useMongoClient:true});

let Column = new mongoose.Schema({
   columnName: String
});

let Department = new mongoose.Schema({
    did: Number,
    name: String,
    location: String,
    column: [Column]
});

let Club = new mongoose.Schema({
    cid: Number,
    name: String,
    logo: String,
    departments: [Department],  //Department
    interviewer: [String],
    password: String,
    maxDep: Number //应试者最多可以选择的部门
});


let rate = new mongoose.Schema({
    did: Number,
    score: Number,
    comment: String,
    interviewer: String
});

let Interviewee = new mongoose.Schema({
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
    extra: Object,
    busy: {
        type: Boolean,
        default: false
    }   //是否正在面试
/*    calling:{
        type: Boolean,
        default: false
    } //是否正在和叫号大厅传输该学生信息*/
});


let studentSchema = new mongoose.Schema({
    club: {
        type: String,
        required: true
    },
    clubID: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true,
        regExp: /^1[0-9]{7}$/
    },
    gender: {
        type: String,
        required: true,
        enum: ['男', '女']
    },
    college: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true,
        regExp: /^(1[34578])[0-9]{9}$/
    },
    qq: {
        type: String,
        required: true,
        regExp: /[1-9][0-9]{4,}/
    },
    short_tel: {
        type: String,
        regExp: /[0-9]{6}$/
    },
    pic_url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required:true
    }

});


exports.Interviewee = mongoose.model('interviewee', Interviewee);
exports.Club = mongoose.model('club', Club);
exports.Student = mongoose.model('student', studentSchema);