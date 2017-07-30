/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();

let Interviewee = require("../modules/interviewee");
/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
/**
 * 测试通过
 */

router.get('/sign', wrap(async function(req, res) {
	let cid = req.param('cid'),
		sid = req.param('sid');
	if(!cid || !sid) {
		throw new Error('参数不完整');
	}

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

router.post('/selectDep', wrap(async function(req, res) {
    let sid = req.param('sid'),
		did = req.param('did'),
		cid = req.session['cid'];
    if(!cid) {
    	throw new Error('参数不完整');
	}

	let result = await Interviewee.selectDep(sid, cid, did);
    res.json(200, result);
}));

/**
 * 测试成功
 */

router.post('/addDep', wrap(async function(req, res) {
	let cid = req.session['cid'];
	if(!cid) throw new Error('参数不完整');

    let info = {
			sid: req.param('sid'),
			volunteer: req.param('did'),
			sex: req.param('sex'),
			name: req.param('name'),
			qq: req.param('qq'),
			phone: req.param('phone'),
			signTime: new Date()
		};

    let result = await Interviewee.addDep(cid, info);
    res.json(200, result);

}));

module.exports = router;