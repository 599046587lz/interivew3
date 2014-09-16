/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

var club = require('../modules/club');
var r = require('./');

/**
 * @params String user 登录用户名
 * @params String name 登录记录名，不影响登录结果，仅作为记录面试官用
 * @params String password 密码，单词md5
 * @return Object {status: 'success'|'failed'}
 */
router.post('/login', function (req, res) {
    var user = req.param('user');
    var password = req.param('password');
    club.login(user, password, function (err, success){
        if (err){
            return res.json(500, err);
        } else {
            if (success){
                req.session.user = user;
                club.getClubByName(user, function (err, clubInfo){
                    if (err){
                        return res.json(500, err);
                    } else {
                        req.session.club = clubInfo.name;
                        req.session.cid = clubInfo.cid;
                        return res.json({status: 'success'});
                    }
                });
            } else {
                return res.json({status: 'failed'});
            }
        }
    });
});

/**
 *
 */
router.get('/logout', r.checkLogin, function (req,res){
    req.session.destroy(function (){
        res.json({status: 'success'});
    });
});

/**
 * 上传应试者资料
 * @params File archive excel文件
 * @return Object {status: 'success'|'failed', count:Number}
 */
router.post('/upload/archive', function (req, res){

});

/**
 * 获取社团资料
 * @return Department
 */
router.get('/profile', function (req, res){

});

/**
 * 更新社团资料
 * @params Department
 * @return Object {status: 'success'|'failed'}
 */
router.post('/profile', function(req, res){

});

module.exports = router;