let fs = require('fs');
let gm = require('gm').subClass({imageMagick: true});
let request = require('request');
let schedule = require('node-schedule');
let clubModel = require('../models').Club;
let interviewModel = require('../models').Interviewee;
let studentModel = require('../models').Student;
let config = require('../config');
let nodemailer = require('nodemailer');
let rp = require('request-promise');
let urlencode = require('urlencode');
let crypto = require('crypto'); //加密
let excel = require('xlsx');
global.departInfo = [ {
    name: '节目部',
    location: '6教中307',
    phone: '18767123351'
}, {
    name: '编辑部',
    location: '6教中305',
    phone: '18767116520'
}, {
    name: '技术部',
    location: '6教中309',
    phone: '13372402413'
}, {
    name: '视频制作部',
    location: '6教中311',
    phone: '17364505450'
}, {
    name: '主持队',
    location: '6教中313',
    phone: '18767119891'
}, {
    name: '办公室',
    location: '6教中315',
    phone: '18367501596'
}, {
    name: '宣传部',
    location: '6教中317',
    phone: '18767132916'
}, {
    name: '外联部',
    location: '6教中319',
    phone: '18758079040'
}
];

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

exports.sendMessage = function (data, reqData) {
    let oneDepart = {};
    global.departInfo.forEach(e => {
        if(e.name == data.volunteer) {
            oneDepart = e;
        }
    });


    let options = {
        method: 'POST',
        uri: 'https://sms.yunpian.com/v2/sms/tpl_single_send.json',
        form: {
            apikey: config.apiKey,
            mobile: data.mobile,
            tpl_id: reqData.tpl_id,
            tpl_value: urlencode("#department#") + "=" + urlencode(data.volunteer) + "&" + urlencode("#location#") + "=" + urlencode(oneDepart.location) + "&" + urlencode("#phone#") + "=" + urlencode(oneDepart.phone) + "&" + urlencode("#time#") + "=" + urlencode(reqData.time)
        },
        headers: {
            'accept': 'application/json',
            'charset': 'utf-8',
            'content-type': 'application/x-www-form-urlencoded',
        },
        json: true
    };

    return rp(options).then(parseBody => {
        console.log(parseBody);
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

exports.md5 = function (data) {
    let hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
};

exports.getExcelInfo = function (file) {
    let header = {};
    let interviewerInfo = [];
    let result = [];
    let workbook = excel.readFile(file.path);
    let workSheet = workbook.Sheets[workbook.SheetNames[0]];
    let keys = Object.keys(workSheet);
    let key = keys.filter(k => k[0] !== '!');
    key.forEach(k => {
        let col = k.substring(0, 1); //A
        let row = parseInt(k.substring(1)); //11
        let value = workSheet[k].v;
        if (row == 1) {
            switch (value) {
                case '姓名':
                    header[col] = 'name';
                    break;
                case '部门':
                    header[col] = 'volunteer';
                    break;
                case '手机号':
                    header[col] = 'mobile';
                    break;
            }
            return;
        }
        if (!interviewerInfo[row]) interviewerInfo[row] = {};
        if (header[col] == undefined) return;
        if (header[col] == 'volunteer') {
            // let departInfo = value.split(',');
            // let result = [];
            // departInfo.forEach(e => {
            //     let oneDepart = department.filter(k => {
            //         return k.name == e
            //     })[0];
            //     result.push(oneDepart.did);
            // });
            interviewerInfo[row][header[col]] = value;
        }
        else {
            interviewerInfo[row][header[col]] = value;
        }
    });

    interviewerInfo.forEach(e => {
        if (e) {
            result.push(e);
        }
    });

    return result;
};


exports.isExist = function (array, info) {
    let status = true;
    array.forEach(e => {
        if(e == info) status = false;
    });

    if(status) {
        array.push(info);
    }
};
