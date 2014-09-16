/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

/**
 * param String user 登录用户名
 * param String name 登录记录名，不影响登录结果，仅作为记录面试官用
 * param String password 密码，单词md5
 * return {status: 'success'|'failed'}
 */
router.post('/login', function (req, res) {
    var user = req.param('user');
    var password = req.param('password');
});

/**
 *
 */
router.get('/logout', function (req,res){

});

/**
 * 上传应试者资料
 * param File archive excel文件
 * return {success:true, count:Number}
 */
router.post('/upload/archive', function (req, res){

});

/**
 * 获取社团资料
 * return Department
 */
router.get('/profile', function (req, res){

});

/**
 * 更新社团资料
 * param
 */
router.post('/profile', function(req, res){

});

module.exports = router;