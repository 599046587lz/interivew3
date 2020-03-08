const path = require('path');
const Router = require('koa-router');
const send = require('koa-send');
const Joi = require('joi');
const Interview = require('../modules/interviewee');
const Club = require('../modules/club');
const qiniu = require('../utils/qiniu');
const mid = require('../utils/middleware');
const office = require('../utils/office');
const utils = require('../utils/utils');
const JSONError = require('../utils/JSONError');

let router = new Router({
   prefix: '/common'
});

router.post('/uploadFile',  async function (ctx) {

    let file = ctx.request.files;
    let fileName = file.file.name;

    let result = await qiniu.qiniuUpload(file.file.path, fileName)

    ctx.response.status = 200;
    ctx.response.body = result;
});

router.get('/download', mid.checkFormat(function () {
    return Joi.object().keys({
        cid: Joi.number()
    })
}),async function (ctx) {
    let cid = ctx.request.query.cid;
    let dbData = await Interview.queryByClubAll(cid);
    let departments = (await Club.getClubInfo(cid)).departments;
    let departName = {};
    departments.forEach(e => {
       departName[e.did] = e.name;
    });
    for (let i in dbData) {
       dbData[i].volunteer.forEach((e, j) => {
          dbData[i].volunteer[j] = departName[e];
       });
        await office.writeWord(dbData[i], i);
    }
    await office.writeExcel(dbData, cid);
    await office.archiverZip(cid);

    const file = path.format({
        dir: path.join(utils.storeFilesPath.zip, cid),
        name: cid,
        ext: '.zip'
    });
    const filename = path.format({
        name: '/files/zip/1/'+ cid,
        ext: '.zip'
    });

    ctx.attachment(file);
    await send(ctx,filename);
});

/**
 * @params Number clubId 社团Id
 * @return 204
 */
//报名界面获取社团信息
router.get('/clubInfo',mid.checkFormat(function () {
        return Joi.object().keys({
            clubId: Joi.number()
        })
}),async function (ctx) {
    let cid = ctx.request.query.clubId;
    let result = await Club.getClubInfo(cid);
    if (!result) {
        throw new JSONError('社团未注册', 403);
    }
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

router.post('/login', mid.checkFormat(function () {
    return Joi.object().keys({
        user: Joi.string().required(),
        password: Joi.string().required()
    })
}),async function (ctx) {
    let {user, password} = ctx.request.body;
    password = utils.md5(String(password));
    let clubInfo = await Club.getClubByName(user);
    if (!(clubInfo && password === clubInfo.password && user === clubInfo.name)){
        throw new JSONError('用户名或密码错误', 403);
    }
        clubInfo = clubInfo.toObject();
        delete clubInfo.password;
        ctx.session.club = clubInfo.name;
        ctx.session.cid = clubInfo.cid;
        ctx.response.status = 200;
        ctx.response.body = clubInfo;
    }
);

module.exports = router;
