let officegen = require('officegen');
let fs = require('fs');
let xlsx = require('xlsx');
let archiver = require('archiver');
let utils = require('./utils');
let Club = require('../modules/club');
global.path = require('path');


exports.writeExcel = function (dbData, clubID) {
    return new Promise(function(resolve, reject) {
        Club.getClubInfo(clubID).then(clubInfo => {
            let departmentInfo = clubInfo.department;
            let departmentName = {};
            departmentInfo.forEach(e => {
                departmentName[e.name.split('-')[0]] = [];
            });

            let _headers = ['club', 'name', 'studentID', 'gender', 'major', 'department', 'intro', 'tel', 'qq', 'short_tel', 'email'];

            dbData.forEach((e, i) => {
                let data = e.toObject();
                delete data.clubID;
                delete data._id;
                dbData[i] = data;
                let mid = {};
                dbData[i].department.forEach(j => {
                    let mainDep = j.split('-')[0];
                    mid[mainDep] = mid[mainDep] || [];
                    mid[mainDep].push(j);
                    // let studentInfo = Object.assign({}, dbData[i]); //拷贝对象
                    // studentInfo.department = j;
                    // let mainDep = j.split('-')[0];
                    // departmentName[mainDep].push(studentInfo);
                });
                for(let j in mid) {
                    let studentInfo = Object.assign({}, dbData[i]);
                    studentInfo.department = mid[j];
                    departmentName[j].push(studentInfo);
                }
            });
            departmentName['总计'] = dbData;
            for(let _data in departmentName) {
                if(departmentName[_data].length == 0) continue;
                let data = departmentName[_data]
                    .map((v, i) => _headers.map((k, j) => Object.assign({}, {
                        v: v[k],
                        position: String.fromCharCode(65 + j) + (i + 2)
                    })))
                    .reduce((prev, next) => prev.concat(next));
                let result = {};
                data.forEach((e, i) => {
                    result[e.position] = {v: (e.v == undefined? '无' : e.v)};
                });
                let newheader = {
                    A1: {v: '社团'},
                    B1: {v: '姓名'},
                    C1: {v: '学号'},
                    D1: {v: '性别' + '[0=女' + ',' + '1=男]'},
                    E1: {v: '专业'},
                    F1: {v: '部门'},
                    G1: {v: '简介'},
                    H1: {v: '手机号'},
                    I1: {v: 'qq'},
                    J1: {v: '短号'},
                    K1: {v: '邮箱'}
                };

                let output = Object.assign({}, newheader, result);

                let outputPos = Object.keys(output);

                let ref = outputPos[0] + ":" + outputPos[outputPos.length - 1];

                let wb = {
                    SheetNames: ['Sheet1'],
                    Sheets: {
                        'Sheet1': Object.assign({}, output, {"!ref": ref})
                    }
                };
                if (!fs.existsSync(__dirname + '/../files/file/' + clubID)) fs.mkdirSync(__dirname + '/../files/file/' + clubID);
                xlsx.writeFile(wb, '../files/file/' + clubID + '/' + _data + '.xlsx');
            }
            resolve('导入成功');
        });
    });
};

exports.writeWord = function (data, index) {
    return new Promise(function (resolve, reject) {
        let docx = officegen({
            'type': 'docx',
            'creator': 'Redhome Studio'
        });
        // let department = [];
        // data.department.forEach(e => {
        //     if(e.column.length > 0) {
        //         e.column.forEach(i => {
        //             department.push(e.departname + '-' + i);
        //         })
        //     } else {
        //         department.push(e.departname);
        //     }
        // });

        let title = '《' + data.club + '报名表》';
        docx.setDocTitle(title);

        docx.on('error', function (err) {
            console.log(err);
        });
        //这里必须为var
        var pObj = docx.createP();
        pObj.options.align = 'center';
        pObj.addText(title, {
            font_face: 'Arial',
            Bold: true,
            font_size: 20

        });

        var pObj = docx.createP();
        try {
            pObj.addImage(path.resolve(data.image), {cx: 300, cy: 200});
        } catch (err) {
            pObj.addText('图片无法加载', {
                font_face: 'Arial',
                font_size: 16
            });
        }

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
        pObj.addText('性别：' + (data.gender > 0 ? '男' : '女'), {
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
        pObj.addText('部门：' + data.department, {
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
        pObj.addText('短号: ' + (data.short_tel || '无'), {
            font_face: 'Arial',
            font_size: 16

        });

        var pObj = docx.createP();
        pObj.addText('个人简介：' + data.intro, {
            font_face: 'Arial',
            font_size: 16

        });

        var pObj = docx.createP();
        pObj.addText('邮箱：' + (data.email || '无'), {
            font_face: 'Arial',
            font_size: 16

        });

        let name = data.name + '-' + data._id;
        let wordPath = __dirname + '/../files/file/' + data.clubID;
        if (fs.existsSync(wordPath) && index == 0) {
            utils.deleteFolder(wordPath);
        }
        if(!fs.existsSync(wordPath)) fs.mkdirSync(wordPath);
        let out = fs.createWriteStream('../files/file/' + data.clubID + '/' + name + '.docx');

        docx.generate(out, function (Error) {
            if (Error) throw Error;
        });
        out.on('error', function (Error) {
            throw Error;
        });
        out.on('close', function() {
            resolve('导入成功');
        })
    });
};

exports.archiverZip = function (clubID) {
    return new Promise(function(resolve, reject) {
        let path = __dirname + '/../files/zip/' + clubID;
        if (fs.existsSync(path)) utils.deleteFolder(path);
        fs.mkdirSync(path);
        let output = fs.createWriteStream(path + '/' + clubID + '.zip');

        let archive = archiver('zip');

        output.on('close', function () {
            resolve('打包成功');
        });

        archive.on('error', function (Error) {
            throw Error;
        });

        archive.pipe(output);
        archive.directory('../files/file/' + clubID + '/', false);
        archive.finalize();
    });
};

