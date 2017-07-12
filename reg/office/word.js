
const express = require('express'),
      officegen = require('officegen'),
      fs = require('fs'),
      path = require('path');
     // gm = require('gm').subClass({imageMagick:true});



exports.writeWord = function ( data ) {

     //压缩图片,要安装GraphicsMagick或ImageMagick,再调用gm压缩
    // gm('../files/image/'+ data.image)
    //     .resize(240, 240, '!')
    //     .write('../files/image/'+ '1'+ data.image, function (err) {
    //         if (!err) console.log('done');
    //     });

    let docx = officegen({
        'type': 'docx',
        'creator': 'Redhome Studio'

    });

    let title = '《'+ data.club + '报名表》';
    docx.setDocTitle(title);

    docx.on('error', function (err) {
        console.log(err);
    });

    var pObj = docx.createP();
    pObj.options.align = 'center';
    pObj.addText(title, {
        font_face: 'Arial',
        Bold: true,
        font_size: 20

    });

    var pObj = docx.createP();
    pObj.addImage(path.resolve('files/image/', data.image));

    var pObj = docx.createP();
    pObj.addText('... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...', {
        font_face: 'Arial',
        ont_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('姓名：' + data.name, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('学号：' + data.studentID, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('性别：' + data.gender, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('学院：' + data.college, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('专业：' + data.major, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('部门：' + data. department, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('联系方式：' + data.tel, {
        font_face: 'Arial',
        font_size: 16

    });
    var pObj = docx.createP();
    pObj.addText('QQ：' + data.qq, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('短号：' + data.short_tel, {
        font_face: 'Arial',
        font_size: 16

    });

    var pObj = docx.createP();
    pObj.addText('个人简介：' + data.intro, {
        font_face: 'Arial',
        font_size: 16

    });


    let name = data.name + '-' + data._id;

    let out = fs.createWriteStream('files/file/' + data.code + '/' + name + '.docx');

    docx.generate(out, {
        'error': function (err) {
            console.log(err);
        }
    });

    out.on ( 'error', function ( err ) {
        console.log (err);
    });

};
