/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
//var debug = require('debug')('interview');
var router = express.Router();

var Club = require('../modules/club');
var Interviewee = require('../modules/interviewee');
var r = require('./index');

/**
 * @params String user 登录用户名
 * @params String password 密码，单词md5
 * @return 204
 */
router.post('/login', function (req, res) {
    var user = req.param('user');
    var password = req.param('password');
    if (!user || !password){
        return res.send(403);
    }
    Club.login(user, password, function (err, success){
        if (err){
            return res.json(500, err);
        } else {
            if (success){
                req.session['user'] = user;
                Club.getClubByName(user, function (err, clubInfo){
                    if (err){
                        return res.json(500, err);
                    } else {
                        req.session.club = clubInfo.name;
                        req.session.cid = clubInfo.cid;
                        return res.send(204);
                    }
                });
            } else {
                return res.send(403);
            }
        }
    });
});

/**
 * @params Number did 部门ID
 * @params String interviewerName 面试官姓名
 * @return HTTP 204
 */
router.post('/setIdentify', function (req, res){
    var name = req.session['club'];
    if(!name) {
        return res.send(403);
    }
    req.session['did'] = req.param('did');
    req.session['interviewer'] = req.param('interviewerName');
    res.send(204);

});

/**
 *
 */
router.get('/logout', r.checkLogin, function (req,res){
    req.session.destroy(function (){
        res.send(204);
    });
});

/**
 * 上传应试者资料
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */
router.post('/upload/archive',function (req, res){
    var file = req.files['archive'];
    if(!file || !req.session['cid']){
        return res.send(403);
    } else {
        var xlsxReg = /\.xlsx$/i;
        if (!xlsxReg.test(file.originalname)){
            return res.send(406);
        }
        Club.handleArchive(file, req.session['cid'], function (err, length){
            if (err){
                if (!!err.line){
                    res.json(404, err);
                } else {
                    res.json(500, err);
                }
            } else {
                res.json({
                    status:'success',
                    count: length
                });
            }
        });
    }

});

/**
 * 获取社团资料
 * @return Department
 */
router.get('/profile', function (req, res){
    var name = req.session['club'];
    if(!name) {
        res.send(403);
    }
    Club.getClubByName(name, function (err, club){
        if(err) {
            res.json(err);
        } else {
            if(false == club) {
                res.json(500);
            } else {
                res.json(club);
            }
        }
    });
});

/**
 * 更新社团资料
 * @params Department
 * @return Object {status: 'success'|'failed'}
 */
router.post('/profile', function (req, res){
    var cid = req.session['cid'];
    if(!cid) {
        res.send(403);
    }
    var dep = req.param('departments'),
        name = req.param('name'),
        password = req.param('password'),
        logo = req.param('logo'),
        maxDep = req.param('maxDep');

    Club.update(cid, {
        departments: dep,
        name: name,
        password: password,
        logo: logo,
        maxDep: maxDep
    }, function (err, clearData){
        if(err) {
            res.json(500, err);
        } else {
            res.send(clearData?205:204);
        }
    });
});

/**
 *  @return array fields
 */
router.get('/extra', function (req, res){
    var cid = req.session['cid'];
    if (!cid){
        res.send(403);
    }
    Interviewee.getIntervieweeBySid({$ne: null}, cid, function (err, doc){
        if (err){
            res.json(500, err);
        } else {
            if (!doc){
                return res.send(404);
            }
            var extra = doc.extra;
            var fields = [];
            for (var i in extra){
                if (extra.hasOwnProperty(i)){
                    fields.push(i);
                }
            }
            res.json(fields);
        }
    } )
});

router.get('/export', function (req, res){
    var cid = req.session['cid'],
        did = req.param('did');
    if (!cid || !did){
        return res.send(403);
    }
    Club.exportInterviewees(cid ,did ,function (err, docs){
        if (err){
            res.json(500, err);
        } else {
            res.json(docs);
        }
    })
});

router.get('/clubInfo', function (req, res) {
    let cid = req.param('clubId');

    (async() => {
       try{
           let result = await Club.getClubInfo(cid);
           return res.json(result);
       } catch (err) {
           return res.send(403);
       }
    })()

});

router.post('/verifyInfo', function(req, res) {
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


module.exports = router;
