const express = require('express'),
      mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/student');
mongoose.connection.on('error',console.error.bind(console,'connection error:'));
mongoose.connection.on('connected', function(){console.log('success!');});
mongoose.connection.on('disconnected', function () {console.log('disconnected!');});


var studentSchema = new mongoose.Schema({
    club:{
        type: String,
        required:true

    },
    code:{
        type: String,
        required:true
    },
    name:{
        type:String,
        required: true
    },
    studentID:{
        type:String,
        required:true,
        regExp:/^1[0-9]{7}$/
    },
    image:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['男','女']
    },
    college:{
        type:String,
        required:true
    },
    major:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    intro:{
        type:String,
        required:true
    },
    tel:{
        type:String,
        required:true,
        regExp:/^(1[34578])[0-9]{9}$/
    },
    qq:{
        type:String,
        required:true,
        regExp:/[1-9][0-9]{4,}/
    },
    short_tel:{
        type:String,
        regExp:/[0-9]{6}$/
    }

});

var student = mongoose.model('Student',studentSchema);

exports.queryByclubAll = function(code) {
    return new Promise(function(resolve, reject) {
        student.find({'code':code},function(err,res){
            if(err){console.log(err); reject(err);}
            else resolve(res);
        });
    })};

exports.addStudent= function(data){
    return new Promise(function(resolve, reject) {

        let Student = new student({
                club: data.club,
                code: data.code,
                name: data.name,
                studentID: data.studentID,
                image: data.image,
                gender: data.gender,
                college: data.college,
                major: data.major,
                department: data.department,
                intro: data.intro,
                tel: data.tel,
                qq: data.qq,
                short_tel: data.short_tel
        });

        Student.save().then(result => {
                resolve(result);
        }).catch(err => {
                reject(err);
        })
    })
};
