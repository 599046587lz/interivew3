/**
 * Created by bangbang93 on 14-9-15.
 */
let wrap = fn => (...args) => fn(...args).catch(args[2]);
let express = require('express');
let router = express.Router();
let Club = require('../modules/club');
let Interviewee = require('../modules/interviewee');
let r = require('../utils/middleware');

/**
 * @params String user 登录用户名
 * @params String password 密码，单词md5
 * @return 204
 */
router.post('/login', wrap(async function (req, res) {
    let user = req.param('user');
    let password = req.param('password');
    if (!user || !password) {
        throw new Error('信息不完整');
    }
    let result = await Club.login(user, password);
    req.session.club = result.name;
    req.session.cid = result.cid;
    res.send(204);
}));

/**
 * @params Number did 部门ID
 * @params String interviewerName 面试官姓名
 * @return HTTP 204
 */
router.post('/setIdentify', function (req, res) {
    let name = req.session['club'];
    if (!name) {
        return res.send(403);
    }
    req.session['did'] = req.param('did');
    req.session['interviewer'] = req.param('interviewerName');
    res.send(204);

});


router.get('/logout', r.checkLogin, function (req, res) {
    req.session.destroy(function () {
        res.send(204);
    });
});

/**
 * 上传应试者资料(未测试)
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */

router.post('/upload/archive', wrap(async function (req, res) {
    let file = req.files['archive'];
    if (!file || !req.session['cid']) throw new Error('参数不完整');
    let xlsxReg = /\.xlsx$/i;
    if (!xlsxReg.test(file.originalname)) throw new Error('上传文件不合法');

    let result = await Club.handleArchive(file, req.session['cid']);
    res.json({
        status: 'success',
        count: result
    });
}));

/**
 * 获取社团资料
 * @return Department
 */
/**
 * 测试通过
 */
router.get('/profile', wrap(async function (req, res) {
    let name = req.session['club'];
    if (!name) {
        throw new Error('参数不完整');
    }

    let info = await Club.getClubByName(name);
    res.json(info);
}));
/**
 * 更新社团资料
 * @params Department
 * @return Object {status: 'success'|'failed'}
 * 测试成功
 */
router.post('/profile', wrap(async function (req, res) {
    let cid = req.session['cid'];
    if (!cid) throw new Error('参数不完整');
    let data = {};
    data.departments = req.param('departments');
    data.name = req.param('name');
    data.password = req.param('password');
    data.logo = req.param('logo');
    data.maxDep = req.param('maxDep');

    let result = await Club.update(cid, data);

    res.send(204);
}));

/**
 *  @return array fields
 */
router.get('/extra', function (req, res) {
    let cid = req.session['cid'];
    if (!cid) {
        res.send(403);
    }
    Interviewee.getIntervieweeBySid({$ne: null}, cid, function (err, doc) {
        if (err) {
            res.json(500, err);
        } else {
            if (!doc) {
                return res.send(404);
            }
            let extra = doc.extra;
            let fields = [];
            for (let i in extra) {
                if (extra.hasOwnProperty(i)) {
                    fields.push(i);
                }
            }
            res.json(fields);
        }
    })
});
/**
 * ??未测试
 */

router.get('/extra', wrap(async function (req, res) {
    let cid = req.session['cid'];
    if (!cid) throw new Error('参数不完整');

    let result = await Interviewee.getIntervieweeBySid({$ne: null}, cid);
    let fields = [];
    for (let i in result.extra) {
        if (result.extra.hasOwnProperty(i)) {
            fields.push(i)
        }
    }

    res.json(fields);
}));


/**
 * 测试通过
 */

router.get('/export', wrap(async function (req, res) {
    let cid = req.session['cid'],
        did = req.param('did');

    if (!cid || !did) {
        throw new Error('参数不完整');
    }

    let result = await Club.exportInterviewees(cid, did);
    res.json(result);
}));

router.get('/clubInfo', function (req, res) {
    let cid = req.param('clubId');
    (async() => {
        try {
            let result = await Club.getClubInfo(cid);

            return res.json(result);
        } catch (err) {
            return res.send(403);
        }
    })()

});

router.post('/verifyInfo', function (req, res) {
    let info = {};
    info.cid = req.body.clubId;
    info.name = req.body.name;

    (async() => {
        try {
            let result = await Club.verifyInfo(info);
            return res.json(result);
        } catch (err) {
            return res.send(403, err);
        }
    })()
});

router.post('/insertInfo', wrap(async function (req, res) {
    let data = {};
    data.cid = req.param('cid');
    data.name = req.param('name');
    data.logo = req.param('logo');
    data.departments = req.param('departments');
    data.interviewer = req.param('interviewer');
    data.password = req.param('password');
    data.maxDep = req.param('maxDep');

    let result = await Club.insertInfo(data);

    res.json(200, result);
}));


module.exports = router;
