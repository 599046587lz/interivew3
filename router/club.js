/**
 * Created by bangbang93 on 14-9-15.
 */
//let wrap = fn => (...args) => fn(...args).catch(args[2]);
let koa = require('koa');
let Router = require('koa-router');
let Club = require('../modules/club');
let Interviewee = require('../modules/interviewee');
let mid = require('../utils/middleware');
let Joi = require('joi');
let utils = require('../utils/utils');
let multer = require('multer');
let upload = multer({dest: utils.storeFilesPath.upload});

let router = new Router({
    prefix: '/club'
});

/**
 * @params Number did 部门ID
 * @params String interviewerName 面试官姓名
 * @return HTTP 204
 */
router.post('/setIdentify', function (ctx,next) {
    let name = ctx.request.session.club;
    console.log(ctx.request.session.club)
    if (!name) {
        return ctx.response.sendStatus(403);
    }
    ctx.request.session['did'] = ctx.request.body.did;
    ctx.request.session['interviewer'] = ctx.request.body.interviewerName;
    ctx.response.send(204);

});


// router.get('/logout', mid.checkLogin, function (ctx,next) {
//     ctx.request.session.destroy(function () {
//         ctx.response.send(204);
//     });
// });

router.get('/logout', function (ctx,next) {
    ctx.request.session.destroy(function () {
        ctx.response.send(204);
    });
});

/**
 * 上传应试者资料
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */

// router.post('/upload/location',mid.checkFormat(function () {
//         return Joi.object().keys({
//             cid: Joi.number(),
//             info: Joi.array(),
//         })
//     }), wrap(async function (req, res) {
//         let info = {};
//         let cid = req.session.cid;
//          info = req.body.info;
//
//         await Club.setRoomLocation(cid, info);
//         res.json({
//             status: 'success',
//         });
//     })
//     );

router.post('/upload/location', async function (ctx,next) {
        let info = {};
        let cid = ctx.request.session.cid;
        info = ctx.request.body.info;

        await Club.setRoomLocation(cid, info);
        ctx.response.json({
            status: 'success',
        });
    });
// router.post('/upload/archive', upload.single('archive'), mid.checkFormat(function() {
//     return Joi.object().keys({
//         cid: Joi.number(),
//     })
// }), wrap(async function (req, res) {
//     let file = req.file;
//     let cid = req.session.cid;
//     let xlsxReg = /\.xlsx$/i;
//     if (!xlsxReg.test(file.originalname)) throw new Error('上传文件不合法');
//     let result = await Club.handleArchive(file, cid);
//     res.json({
//         status: 200,
//         count: result
//     });
// }));

router.post('/upload/archive', async function (ctx,next) {
    let file = ctx.request.file;
    let cid = ctx.request.session.cid;
    let xlsxReg = /\.xlsx$/i;
    if (!xlsxReg.test(file.originalname)) throw new Error('上传文件不合法');
    let result = await Club.handleArchive(file, cid);
    ctx.response.json({
        status: 200,
        count: result
    });
});

/**
 * ??未测试
 */

// router.get('/extra', wrap(async function (req, res) {
//     let cid = req.session['cid'];
//     if (!cid) throw new Error('参数不完整');
//
//     let result = await Interviewee.getIntervieweeBySid({$ne: null}, cid);
//     let fields = [];
//     for (let i in result.extra) {
//         if (result.extra.hasOwnProperty(i)) {
//             fields.push(i)
//         }
//     }
//
//     res.json(fields);
// }));

router.get('/extra',async function (ctx,next) {
    let cid = ctx.request.session['cid'];
    if (!cid) throw new Error('参数不完整');

    let result = await Interviewee.getIntervieweeBySid({$ne: null}, cid);
    let fields = [];
    for (let i in result.extra) {
        if (result.extra.hasOwnProperty(i)) {
            fields.push(i)
        }
    }

    ctx.response.json(fields);
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
        throw new JSONError('参数不完整');
    }
    let result = [];
    if(did === undefined){
        result = await Club.exportAllInterviewees(cid);
    } else {
        result = await Club.exportInterviewees(cid,did)
    }
    ctx.response.body = result;
});


// router.get('/clubInfo', mid.checkFormat(function () {
//     return Joi.object().keys({
//         clubId: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let cid = req.session.cid;
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
//
// router.post('/verifyInfo', mid.checkFormat(function() {
//     return Joi.object().keys({
//         clubId: Joi.number(),
//         name: Joi.string()
//     })
// }), wrap(async function (req, res) {
//     let info = {};
//     info.cid = req.body.clubId;
//     info.name = req.body.name;
//     let result = await Club.verifyInfo(info);
//     return res.json(result);
// }));

// router.get('/clubInfo',async function (ctx,next) {
//     let cid = ctx.request.session.cid;
//     let result = await Club.getClubInfo(cid);
//     let info = {
//         clubName: result.name,
//         departments: result.departments,
//         maxDep: result.maxDep,
//         attention: result.attention
//     };
//
//     ctx.response.status = 200;
//     ctx.response.body = info;
// });

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

router.post('/verifyInfo', async function (ctx,next) {
    let info = {};
    info.cid = ctx.req.body.clubId;
    info.name = ctx.req.body.name;
    let result = await Club.verifyInfo(info);
    //return res.json(result);
    ctx.response = result;
});
/**
 * 临时接口
 */

// router.post('/insertInfo', wrap(async function (req, res) {
//     let data = {};
//     data.cid = req.body.cid;
//     data.name = req.body.name;
//     data.logo = req.body.logo;
//     data.departments = req.body.departments;
//     data.interviewer = req.body.interviewer;
//     data.password = req.body.password;
//     data.maxDep = req.body.maxDep;
//     data.attention = req.body.attention;
//
//     let result = await Club.insertInfo(data);
//
//     res.json(200, result);
// }));

router.post('/insertInfo', async function (ctx,next) {
    let data = {};
    data.cid = ctx.req.body.cid;
    data.name = ctx.req.body.name;
    data.logo = ctx.req.body.logo;
    data.departments = ctx.req.body.departments;
    data.interviewer = ctx.req.body.interviewer;
    data.password = ctx.req.body.password;
    data.maxDep = ctx.req.body.maxDep;
    data.attention = ctx.req.body.attention;

    let result = await Club.insertInfo(data);

    ctx.res.json(200, result);
});

// router.get('/regNum', mid.checkFormat(function() {
//     return Joi.object().keys({
//         clubId: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let clubId = req.body.clubId;
//     let result = await Club.getRegNum(clubId);
//     res.send(200, result);
// }));

router.get('/regNum', async function (ctx,next) {
    let clubId = ctx.req.body.clubId;
    let result = await Club.getRegNum(clubId);
    ctx.res.send(200, result);
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

router.post('/sendMessage', async function(ctx,next) {
    let reqData = {};
    reqData.tpl_id = ctx.req.body.tpl_id;
    reqData.time = ctx.req.body.time;

    let file = ctx.req.file;
    let data = utils.getExcelInfo(file);
    for(let i of data) {
        let result = await utils.sendMessage(i, reqData);
    }
    ctx.res.send(200, '发送成功');
});

// router.post('/sendEmail', wrap(async function(req, res) {
//     let data = req.body;
//     await utils.sendMail(data);
//     res.send(200, '发送成功');
// }));

router.post('/sendEmail',async function(ctx,next) {
    let data = ctx.req.body;
    await utils.sendMail(data);
    ctx.res.send(200, '发送成功');
});

// router.post('/profile', mid.checkFormat(function () {
//     return Joi.object().keys({
//         cid: Joi.number(),
//         departments: Joi.array().items(Joi.object().keys({
//             did: Joi.number(),
//             name: Joi.string(),
//             location: Joi.string()
//         })),
//         name: Joi.string(),
//         password: Joi.string(),
//         logo: Joi.string(),
//         maxDep: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let cid = req.body.cid;
//     if (!cid) throw new Error('参数不完整');
//     let data = {};
//     data.cid = req.body.cid;
//     data.departments = req.body.departments;
//     data.name = req.body.name;
//     data.password = utils.md5(req.body.password);
//     data.logo = req.body.logo;
//     data.maxDep = req.body.maxDep;
//
//     await Club.createClub(data);
//
//     res.send(204);
// }));

router.post('/profile',async function (ctx,next) {
    let cid = ctx.req.body.cid;
    if (!cid) throw new Error('参数不完整');
    let data = {};
    data.cid = ctx.req.body.cid;
    data.departments = ctx.req.body.departments;
    data.name = ctx.req.body.name;
    data.password = utils.md5(ctx.req.body.password);
    data.logo = ctx.req.body.logo;
    data.maxDep = ctx.req.body.maxDep;

    await Club.createClub(data);

    ctx.res.send(204);
});

// router.post('/init', wrap(async function (req, res) {
//     let cid = req.body.cid;
//
//     await Club.initClub(cid);
//     res.send(204);
// }))

router.post('/init', async function (ctx,next) {
    let cid = ctx.req.body.cid;

    await Club.initClub(cid);
    ctx.res.send(204);
});

module.exports = router;
