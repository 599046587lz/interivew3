let fs = require('fs');
let gm = require('gm').subClass({imageMagick: true});
let request = require('request');
let schedule = require('node-schedule');
let clubModel = require('../models').Club;
let interviewModel = require('../models').Interviewee;
let studentModel = require('../models').Student;

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