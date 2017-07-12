//upload.js
const express = require('express'),
      multer = require('multer'),
      md5 = require('md5');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../upload/image');

    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, md5(file) + Date.now() + "." + fileFormat[fileFormat.length - 1]);

    }
});

var fileupload = multer({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 3 * 1024 * 1024
    }},function(err){
       console.log(err);
    });
let fileFileter = function (file) {

    let fileFormat = (file.originalname).split(".");

    return (fileFormat[fileFormat.length - 1] === 'jpg');

};

exports.fileupload = fileupload.single('image');
exports.fileFileter = fileFileter;
