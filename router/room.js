/**
 * Created by bangbang93 on 14-9-15.
 */
//let wrap = fn => (...args) => fn(...args).catch(args[2]);
let koa = require('koa');
let Router = require('koa-router');
let Interviewee = require("../modules/interviewee");
let Joi = require('joi');
let mid = require('../utils/middleware');
let JSONError = require('../utils/JSONError');
let club = require('../modules/club');

let router = new Router({
    prefix: '/room'
});

/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
/**
 * 测试通过
 */

// router.get('/sign', mid.checkFormat(function () {
//     return Joi.object().keys({
//         sid: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let cid = req.session.cid;
//     let sid = req.query.sid;
//     let info = await Interviewee.getInterviewerInfo(sid, cid);
//     if (!info) {
//         throw new JSONError('该学生未报名', 403);
//     }
//     if (info.signTime) {
//         info = null;
//     } else {
//         info.signTime = new Date();
//         info.save();
//     }
//     res.json({
//         status: 200,
//         data: info
//     });
// }));

router.get('/sign', async function (ctx,next) {
    let cid = ctx.req.session.cid;
    let sid = ctx.req.query.sid;
    let info = await Interviewee.getInterviewerInfo(sid, cid);
    if (!info) {
        throw new JSONError('该学生未报名', 403);
    }
    if (info.signTime) {
        info = null;
    } else {
        info.signTime = new Date();
        info.save();
    }
    ctx.res.status = 200;
    ctx.res.data = info;
});

// router.get('/finish', async function (req, res) {
//     let cid = req.session.cid
//     let info = await Interviewee.getFinishInfo(cid)
//     res.json({
//         status: 200,
//         data: info
//     });
// });

router.get('/finish', async function (ctx,next) {
    let cid = ctx.req.session.cid
    let info = await Interviewee.getFinishInfo(cid)
    ctx.res.status = 200;
    ctx.res.data = info;
});

// router.get('/sighed', async function (req, res) {
//     let cid = req.session.cid
//     let info = await Interviewee.getSignedInterviewee(cid)
//     res.json({
//         status: 200,
//         data: info
//     })
// })

router.get('/sighed', async function (ctx,next) {
    let cid = ctx.req.session.cid
    let info = await Interviewee.getSignedInterviewee(cid)
    ctx.res.status = 200;
    ctx.res.data = info;
});

// router.get('/calling', async function (req, res) {
//     let cid = req.session.cid
//     let info = await Interviewee.callNextInterviewee(cid)
//     res.json({
//         status: 200,
//         data: info
//     })
//
// });

router.get('/calling', async function (ctx,next) {
    let cid = ctx.req.session.cid
    let info = await Interviewee.callNextInterviewee(cid)
    ctx.res.status = 200;
    ctx.res.data = info;
});

/**
 * 测试成功
 */
// router.post('/addDep', mid.checkFormat(function () {
//     return Joi.object().keys({
//         sid: Joi.number(),
//         did: Joi.number(),
//         sex: Joi.number(),
//         name: Joi.string(),
//         qq: Joi.number(),
//         phone: Joi.number()
//     })
// }), wrap(async function (req, res) {
//     let info = {
//         sid: req.body.sid,
//         volunteer: req.body.did,
//         sex: req.body.sex,
//         name: req.body.name,
//         qq: req.body.qq,
//         phone: req.body.phone,
//         signTime: new Date()
//     };
//
//     let result = await Interviewee.addInterviewee(info, cid);
//     res.json({
//         status: 200,
//         message: result
//     });
//
// }));

router.post('/addDep', async function (ctx,next) {
    let info = {
        sid: ctx.req.body.sid,
        volunteer: ctx.req.body.did,
        sex: ctx.req.body.sex,
        name: ctx.req.body.name,
        qq: ctx.req.body.qq,
        phone: ctx.req.body.phone,
        signTime: new Date()
    };

    let result = await Interviewee.addInterviewee(info, cid);
    ctx.res.status = 200;
    ctx.res.body = result;
});

// router.get('/getDepartmentInfo', wrap(async function (req, res) {
//     let cid = req.session.cid
//     let result = await club.getDepartmentInfo(cid)
//     res.json({
//         status: 200,
//         message: result
//     });
//
// }))

router.get('/getDepartmentInfo', async function (ctx,next) {
    let cid = ctx.req.session.cid
    let result = await club.getDepartmentInfo(cid)
    ctx.res.status = 200;
    ctx.res.body = result;
});

module.exports = router;