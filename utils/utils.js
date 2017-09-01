let fs = require('fs');
let gm = require('gm').subClass({imageMagick: true});
let request = require('request');
let schedule = require('node-schedule');
let clubModel = require('../models').Club;
let interviewModel = require('../models').Interviewee;
let studentModel = require('../models').Student;
let SMSClient = require('@alicloud/sms-sdk');
let config = require('../config');
let nodemailer = require('nodemailer');

exports.image_save = function (url, filename) {
    return new Promise(function (resolve, reject) {
        request.get(url).on('response', response => {
            response.pause();
            resolve(response);
        });
    }).then(response => {
        if (!fs.existsSync(__dirname + '/../files/image')) fs.mkdirSync(__dirname + '/../files/image');
        response.pipe(fs.createWriteStream('../files/image/' + filename));
        return '../files/image/' + filename;
    })
};

exports.saveDb = function () {
    schedule.scheduleJob('0 0 0 * * *', function () {
        let date = new Date();
        let dir = __dirname + '/../files/db/' + date.toLocaleDateString();
        let path;
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        clubModel.find().then(result => {
            path = dir + '/clubs.json';
            fs.writeFileSync(path, JSON.stringify(result));
            return interviewModel.find();
        }).then(result => {
            path = dir + '/interviewees.json';
            fs.writeFileSync(path, JSON.stringify(result));
            return studentModel.find()
        }).then(result => {
            path = dir + '/students.json';
            fs.writeFileSync(path, JSON.stringify(result));
        }).catch(err => {
            throw err;
        })
    })
};

exports.deleteFolder = function (path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                exports.deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.sendMessage = function (data) {
    let accessKeyId = config.accessKeyId;
    let secretAccessKey = config.secretAccessKey;
    let smsClient = new SMSClient({accessKeyId, secretAccessKey});

    return smsClient.sendSMS({
        PhoneNumbers: data.phoneNumber,
        SignName: data.signName,
        TemplateCode: data.templateCode,
        TemplateParam: data.templateParam
    }).then(res => {
        let {Code} = res;
        if(Code == 'OK') {
            return res;
        }
    })
} ;

exports.sendMail = function (data) {
    return new Promise(function (resolve, reject) {
        let transporter = nodemailer.createTransport({
            service: 'qq',
            port: 465, // SMTP 端口
            secureConnection: true, // 使用 SSL
            auth: {
                user: config.mailUser,
                //这里密码不是qq密码，是你设置的smtp密码
                pass: config.mailPassword
            }
        });

        let mailOptions = {
            from: data.from + '<' + config.mailUser + '>', // 发件地址
            to: data.receiver, // 收件列表
            subject: data.subject, // 标题
            //text和html两者只支持一种
            text: data.text, // 标题
            html: data.html // html 内容
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return reject(error);
            }
            return resolve();
        });
    });

};