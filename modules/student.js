let studentModel = require('../models').Student;

exports.queryByClubAll = function (clubID) {

    return studentModel.find({'clubID': clubID}).then(result => {
        return (result);
    });

};

exports.addStudent = function (data) {

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
        email: data.email,
        pic_url: data.pic_url,
        image: data.image
    });

    return Student.save().then(result => {
        return ("报名成功！");
    });
};

exports.checkStudent = function(studentID, clubID) {
    return studentModel.findOne({
        studentID: studentID,
        clubID: clubID
    }).then(result => {
        if(!!result) {
            let err = new Error('该同学已注册');
            err.status = 403;
            throw err;
        }
        return true;
    })
};
