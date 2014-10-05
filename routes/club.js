/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var debug = require('debug')('interview');
var router = express.Router();

var club = require('../modules/club');
var r = require('./');

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
    club.login(user, password, function (err, success){
        if (err){
            return res.json(500, err);
        } else {
            if (success){
                req.session['user'] = user;
                club.getClubByName(user, function (err, clubInfo){
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
router.post('/upload/archive', function (req, res){
    var file = req.files.archive;
    if(!file || !req.session['cid']){
        return res.send(403);
    } else {
        club.handleArchive(file, req.session['cid'], function (err, length){
            if (err){
                res.json(err);
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
    debug(JSON.stringify(req.session));
    if(!name) {
        res.send(403);
    }
    club.getClubByName(name, function (err, club){
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
    var dep = req.param['Department'];

    club.update(cid,dep,function (err){
        if(err) {
            res.json(500, err);
        } else {
            res.json(204);
        }
    });
});

/**
 *
 */
router.get('/extra', function (req, res){

});

module.exports = router;