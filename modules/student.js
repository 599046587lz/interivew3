const studentModel = require('../models').Student;

exports.queryByclubAll = function (clubID) {
    return new Promise(function (resolve, reject) {
        studentModel.find({'code': code}, function (err, res) {
            if (err) {
                reject(err);
            }
            else resolve(res);
        });
    })
};

exports.addStudent = function (data) {
    return new Promise(function (resolve, reject) {

        let Student = new studentModel({
            club: data.club,
            clubID: data.clubID,
            name: data.name,
            studentID: data.studentID,
            gender: data.gender,
            college: data.college,
            major: data.major,
            department: data.department,
            intro: data.intro,
            tel: data.tel,
            qq: data.qq,
            short_tel: data.short_tel,
            pic_url: data.pic_url,
            image: data.image
        });

        Student.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
};
