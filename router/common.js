const koa = require('koa');
let qiniu = require('../utils/qiniu');
const path = require('path');
const Router = require('koa-router');
let mid = require('../utils/middleware');
let Interview = require('../modules/interviewee');
let Club = require('../modules/club');
let office = require('../utils/office');
let utils = require('../utils/utils');
let upload = require('multer')({dest: utils.storeFilesPath.upload});
let JSONError = require('../utils/JSONError');
let Joi = require('joi');


let router = new Router({
   prefix: '/common'
});



// let wrap = fn => (...args) => fn(...args).catch(args[2]);
//
// router.post('/uploadFile', upload.single('file'), wrap(async function (req, res) {
//
//     let file = req.file;
//     let fileName = file.originalname;
//
//     let result = await qiniu.qiniuUpload(file.path, fileName)
//
//     res.send(200, result);
// }));
//
// router.get('/download', mid.checkFormat(function () {
//     return Joi.object().keys({
//         cid: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let cid = req.query.cid;
//     let dbData = await Interview.queryByClubAll(cid);
//     let departments = (await Club.getClubInfo(cid)).departments;
//     let departName = {};
//     departments.forEach(e => {
//        departName[e.did] = e.name;
//     });
//     for (let i in dbData) {
//        dbData[i].volunteer.forEach((e, j) => {
//           dbData[i].volunteer[j] = departName[e];
//        });
//         await office.writeWord(dbData[i], i);
//     }
//     await office.writeExcel(dbData, cid);
//     await office.archiverZip(cid);
//
//     const file = path.format({
//         dir: path.join(utils.storeFilesPath.zip, cid),
//         name: cid,
//         ext: '.zip'
//     });
//     const filename = path.format({
//         name: cid,
//         ext: '.zip'
//     });
//     res.download(file, filename);
// }));

/**
 * @params Number clubId 社团Id
 * @return 204
 */
//报名界面获取社团信息
// router.get('/clubInfo', mid.checkFormat(function () {
//         return Joi.object().keys({
//             clubId: Joi.number()
//         })
// }), wrap(async function (req, res) {
//     let cid = req.query.clubId;
//     let result = await Club.getClubInfo(cid);
//     let info = {
//         clubName: result.name,
//         departments: result.departments,
//         maxDep: result.maxDep,
//         attention: result.attention
//     };
//
//     return res.json({
//         status: 200,
//         message: info
//     });
// }));

router.get('/clubInfo',  mid.checkFormat(function () {
        return Joi.object().keys({
            clubId: Joi.number()
        })
}), async function (ctx,next) {
    let cid = ctx.request.query.clubId;
    let result = await Club.getClubInfo(cid);
    let info = {
        cid:result.cid,
        clubName: result.name,
        departments: result.departments,
        maxDep: result.maxDep,
        attention: result.attention
    };

    ctx.response.status = 200;
    ctx.response.body = info;
});

/**
 * @params String user 登录用户名
 * @params String password 密码，单词md5
 * @return 204
 */


// router.post('/login', mid.checkFormat(function () {
//     return Joi.object().keys({
//         user: Joi.string().required(),
//         password: Joi.string().required()
//     })
// }), wrap(async function (req, res) {
//     let user = req.body.user;
//     let password = utils.md5(req.body.password);
//     let clubInfo = await Club.getClubByName(user);
//     if (clubInfo && password == clubInfo.password && user == clubInfo.name) {
//         clubInfo = clubInfo.toObject();
//         delete clubInfo.password;
//         req.session.club = clubInfo.name;
//         req.session.cid = clubInfo.cid;
//         return res.json({
//             status: 200,
//             message: clubInfo
//         });
//     } else {
//         throw new JSONError('用户名或密码错误', 403);
//     }
// }));
router.post('/login',mid.checkFormat(function () {
    return Joi.object().keys({
        user: Joi.string().required(),
        password: Joi.string().required()
    })
}),  async function (ctx) {
    let {user, password} = ctx.request.body;
    password = utils.md5(String(password));
    let clubInfo = await Club.getClubByName(user);
    if (clubInfo && password == clubInfo.password && user == clubInfo.name) {
        clubInfo = clubInfo.toObject();
        delete clubInfo.password;
        ctx.session.club = clubInfo.name;
        ctx.session.cid = clubInfo.cid;
        ctx.response.status = 200;
        ctx.response.body = clubInfo;
    } else {
        // throw new JSONError('用户名或密码错误', 403);
        const err = new Error("用户名或密码错误");
        err.status = 403;
        err.expose = true;
        throw err;
    }
});

module.exports = router;
