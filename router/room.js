/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Interviewee = require("../modules/interviewee");
let Joi = require('Joi');
let mid = require('../utils/middleware');
/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
/**
 * 测试通过
 */

router.get('/sign', mid.checkFormat(function() {
	return Joi.object().keys({
		cid: Joi.number(),
		sid: Joi.number()
	})
}), wrap(async function(req, res) {
	let cid = req.param('cid');
	let sid = req.param('sid');

	let result = await Interviewee.sign(sid, cid);

	res.json(result);
}));

/**
 * @params sid
 * @params did[]
 * @return Object {status: 'success'}
 */
/**
 * 未测试(需学校内网)
 */

router.post('/selectDep', mid.checkFormat(function() {
	return Joi.object().keys({
		sid: Joi.number(),
		did: Joi.number(),
	})
}), wrap(async function(req, res) {
    let sid = req.body.sid;
	let did = req.body.did;
	let cid = req.session.cid;

	let result = await Interviewee.selectDep(sid, cid, did);
    res.json(200, result);
}));

/**
 * 测试成功
 */

router.post('/addDep', mid.checkFormat(function() {
	return Joi.object().keys({
		sid: Joi.number(),
		did: Joi.number(),
		sex: Joi.number(),
		name: Joi.string(),
		qq: Joi.number(),
		phone: Joi.number()
	})
}), wrap(async function(req, res) {
	let cid = req.body.cid;
	if(!cid) throw new Error('参数不完整');

    let info = {
			sid: req.body.sid,
			volunteer: req.body.did,
			sex: req.body.sex,
			name: req.body.name,
			qq: req.body.qq,
			phone: req.body.phone,
			signTime: new Date()
		};

    let result = await Interviewee.addDep(cid, info);
    res.json(200, result);

}));

module.exports = router;