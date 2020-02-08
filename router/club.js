/**
 * Created by bangbang93 on 14-9-15.
 */
let Router = require('koa-router');
let Club = require('../modules/club');
let Interviewee = require('../modules/interviewee');
let mid = require('../utils/middleware');
let Joi = require('joi');
let utils = require('../utils/utils');
let JSONError = require('../utils/JSONError');


let router = new Router({
    prefix: '/club'
});

/**
 * @params Number did 部门ID
 * @params String interviewerName 面试官姓名
 * @return HTTP 204
 */

router.post('/setIdentify', function (ctx) {
    let name = ctx.session.club;
    console.log(ctx.session.club)
    if (!name) {
        return ctx.response.status = 403;
    }
    ctx.session.did = ctx.request.body.did;
    ctx.session.interviewer = ctx.request.body.interviewerName;
    ctx.response.status = 204;

});


// router.get('/logout', mid.checkLogin, function (ctx,next) {
//     ctx.request.session.destroy(function () {
//         ctx.response.send(204);
//     });
// });

//找不到地方测
router.get('/logout',  mid.checkLogin,function (ctx) {
    ctx.session = null;
    ctx.response.status = 204;
    //
    // ctx.session.destroy(function () {
    //     ctx.response.status = 204;
    // });
});

/**
 * 上传应试者资料
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */


router.post('/upload/location',mid.checkFormat(function () {
        return Joi.object().keys({
            cid: Joi.number(),
            info: Joi.array(),
        })
    }), async function (ctx) {
        let info = {};
        let cid = ctx.session.cid;
        info = ctx.request.body.info;

        await Club.setRoomLocation(cid, info);
        ctx.response.status = 200;
    });

//success
router.post('/upload/archive', mid.checkFormat(function() {
    return Joi.object().keys({
        cid: Joi.number(),
    })
}), async function (ctx) {
    let file = ctx.request.files;
    let cid = ctx.session.cid;
    let xlsxReg = /\.xlsx$/i;
    if (!xlsxReg.test(file.archive.name)) throw new JSONError('上传文件不合法', 403);
    let result = await Club.handleArchive(file, cid);
    ctx.response.status = 200;
    ctx.response.body = result;

});

/**
 * ??未测试
 */


//没看懂在干嘛但是跑成功了 result.extra指什么？
router.get('/extra',async function (ctx) {
    let cid = ctx.session.cid;
    if (!cid) throw new JSONError('参数不完整', 403);

    let result = await Interviewee.getIntervieweeBySid({$ne: null}, cid);
    let fields = [];
    for (let i in result.extra) {
        if (result.extra.hasOwnProperty(i)) {
            fields.push(i)
        }
    }

    ctx.response.body = fields;
});


/**
 * 测试通过
 */


router.get('/export', mid.checkFormat(function () {
    return Joi.object().keys({
        did: Joi.number(),
        search: Joi.string() || '',
        page: Joi.number(),
        pageSize: Joi.number()
    })
}),async function (ctx) {
    let cid = ctx.session.cid;
    let did = ctx.request.query.did;

    if (!cid) {
        throw new JSONError('参数不完整', 403);
    }
    let result = [];
    if(did === undefined){
        result = await Club.exportAllInterviewees(cid);
    } else {
        result = await Club.exportInterviewees(cid,did)
    }
    ctx.response.body = result;
});


//success
router.get('/clubInfo',  mid.checkFormat(function () {
    return Joi.object().keys({
        clubId: Joi.number()
    })
}), async function (ctx) {
    let cid = ctx.session.cid;
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

//success
router.post('/verifyInfo', async function (ctx) {
    let info = {};
    info.cid = ctx.request.body.cid;
    info.clubName = ctx.request.body.name;
    let result = await Club.verifyInfo(info);
    ctx.response.body = result;
});
/**
 * 临时接口
 */


//success 返回204
router.post('/insertInfo', async function (ctx) {
    let data = {};
    data.cid = ctx.request.body.cid;
    data.name = ctx.request.body.name;
    data.logo = ctx.request.body.logo;
    data.departments = ctx.request.body.departments;
    data.interviewer = ctx.request.body.interviewer;
    data.password = ctx.request.body.password;
    data.maxDep = ctx.request.body.maxDep;
    data.attention = ctx.request.body.attention;

    let result = await Club.insertInfo(data);

    ctx.response.status = 200;
    ctx.response.body = result;
});


//success
router.get('/regNum',mid.checkFormat(function() {
    return Joi.object().keys({
        clubId: Joi.number()
    })
}),  async function (ctx) {
    let clubId = ctx.request.query.clubId;
    let result = await Club.getRegNum(clubId);
    ctx.response.status = 200;
    ctx.response.body = result;
});

// router.post('/sendMessage', upload.single('archive'), wrap(async function(req, res) {
//     let reqData = {};
//     reqData.tpl_id = req.body.tpl_id;
//     reqData.time = req.body.time;
//
//     let file = req.file;
//     let data = utils.getExcelInfo(file);
//     for(let i of data) {
//         let result = await utils.sendMessage(i, reqData);
//     }
//     res.send(200, '发送成功');
// }));

//失败 可成功获取表中姓名电话等信息
router.post('/sendMessage', async function(ctx) {
    let reqData = {};
    reqData.tpl_id = ctx.request.body.tpl_id;
    reqData.time = ctx.request.body.time;

    let file = ctx.request.files;
    let data = utils.getExcelInfo(file);
    for(let i of data) {
        await utils.sendMessage(i, reqData);
    }
    ctx.response.send(200, '发送成功');
});

// router.post('/sendEmail', wrap(async function(req, res) {
//     let data = req.body;
//     await utils.sendMail(data);
//     res.send(200, '发送成功');
// }));
//失败
router.post('/sendEmail',async function(ctx) {
    let data = ctx.request.body;
    await utils.sendMail(data);
    ctx.response.status = 200;
    ctx.response.body = '发送成功';
});

//success
router.post('/profile',mid.checkFormat(function () {
    return Joi.object().keys({
        cid: Joi.number(),
        departments: Joi.array().items(Joi.object().keys({
            did: Joi.number(),
            name: Joi.string(),
            location: Joi.string()
        })),
        name: Joi.string(),
        password: Joi.string(),
        logo: Joi.string(),
        maxDep: Joi.number()
    })
}), async function (ctx) {
    let cid = ctx.request.body.cid;
    if (!cid) throw new JSONError('参数不完整', 403);
    let data = {};
    data.cid = ctx.request.body.cid;
    data.departments = ctx.request.body.departments;
    data.name = ctx.request.body.name;
    data.password = utils.md5(ctx.request.body.password);
    data.logo = ctx.request.body.logo;
    data.maxDep = ctx.request.body.maxDep;

    await Club.createClub(data);

    ctx.response.status = 204;
});


//success
router.post('/init', async function (ctx) {
    let cid = ctx.request.body.cid;

    await Club.initClub(cid);
    ctx.response.status = 204;
});

module.exports = router;
