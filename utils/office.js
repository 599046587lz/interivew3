let officegen = require('officegen');
let fs = require('fs');
global.path = require('path');
let xlsx = require('xlsx');
let archiver = require('archiver');

exports.writeExcel = function (dbData, clubID) {
    return new Promise(function(resolve, reject) {
        let _headers = ['club', 'name', 'studentID', 'gender', 'major', 'department', 'intro', 'tel', 'qq', 'email'];

        let _data = dbData;
        _data.forEach((e, i) => {
            let data = e.toObject();
            delete data.clubID;
            delete data._id;
            _data[i] = data;
        });

        let data = _data
            .map((v, i) => _headers.map((k, j) => Object.assign({}, {
                v: v[k],
                position: String.fromCharCode(65 + j) + (i + 2)
            })))
            .reduce((prev, next) => prev.concat(next));
        // .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}));
        let result = {};
        data.forEach((e, i)=> {
            if(e.position.charAt(0) == 'F') {
                let array = [];
                e.v.forEach(j => {
                    if(j.column.length > 0) {
                        j.column.forEach(k => {
                            array.push(j.departname + '-' + k);
                        })
                    } else {
                        array.push(j.departname);
                    }
                });
                e.v = array;
            }
            result[e.position] = {v: e.v};
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
            J1: {v: '邮箱'}
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
        xlsx.writeFile(wb, '../files/file/' + clubID + '/data.xlsx');
        resolve('导入成功');
    });
};

exports.writeWord = function (data) {
    return new Promise(function (resolve, reject) {
        let docx = officegen({
            'type': 'docx',
            'creator': 'Redhome Studio'
        });
        let department = [];
        data.department.forEach(e => {
            if(e.column.length > 0) {
                e.column.forEach(i => {
                    department.push(e.departname + '-' + i);
                })
            } else {
                department.push(e.departname);
            }
        });

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
        pObj.addText('部门：' + department, {
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
        pObj.addText('邮箱：' + data.email, {
            font_face: 'Arial',
            font_size: 16

        });

        var pObj = docx.createP();
        pObj.addText('个人简介：' + data.intro, {
            font_face: 'Arial',
            font_size: 16

        });

        let name = data.name + '-' + data._id;
        if (!fs.existsSync(__dirname + '/../files/file/' + data.clubID)) fs.mkdirSync(__dirname + '/../files/file/' + data.clubID);
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
        if (!fs.existsSync(__dirname + '/../files/zip/' + clubID)) fs.mkdirSync(__dirname + '/../files/zip/' + clubID);
        let output = fs.createWriteStream('../files/zip/' + clubID + '/' + clubID + '.zip');

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

