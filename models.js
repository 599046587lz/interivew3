/**
 * Created by bangbang93 on 14-9-15.
 */
let mongoose = require('mongoose');
let config = require('./config');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);


let Department = new mongoose.Schema({
    did: Number,
    name: String,
    location: String,
    number: {
        type: Number,
        default: 0
    }
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
    score:  {
        type: Number,
        enum:
            {
                values: [0, 1, 2], //0: 待录用  1:录用 2:不录用
                message: "请输入正确的分数"
            }
    },
    comment: String,
    interviewer: String
});

let Interviewee = new mongoose.Schema({
    clubName: String,
    sid: Number,
    cid: Number,
    name: {
        type: String,
        default: ''
    },
    sex: {
        type: Number,
        default: 2   //0女1男2秀吉
    },
    major: {
        type: String,
    },
    phone: {
        type: String,
    },
    short_tel: {
        type: String,
    },
    qq: {
        type: String,
    },
    volunteer: [Number],
    notion: {
        type: String,
        default: ''
    },
    signTime: Date,
    rate: [rate],//{did: Number,score: Number, comment: String, interviewer: String}
    done: [Number],
    busy: {
        type: Boolean,
        default: false
    }, //是否正在面试
    /*    calling:{
            type: Boolean,
            default: false
        } //是否正在和叫号大厅传输该学生信息*/
    email: {
        type: String,
        default: ''
    },
    pic_url: {
        type: String,
    },
    image: {
        type: String,
    },
    college: {
        type: String
    }
});





exports.Interviewee = mongoose.model('interviewee', Interviewee);
exports.Club = mongoose.model('club', Club);
