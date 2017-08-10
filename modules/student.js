const studentModel = require('../models').Student;

exports.queryByclubAll = function (clubID) {

    return studentModel.find({'clubID': clubID}).then(result =>{return(result);});

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
            short_tel: data.short_tel,
            pic_url: data.pic_url,
            image: data.image
        });

         Student.save().then(result => {
            return("报名成功！");
    });
};
