/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

/**
 * @params sid
 * @params department
 * @return Object {status: 'success'|'failed'}
 */
router.post('/recommand', function (req, res){
    var interviewee = req.param('interviewee');
    var department = req.param('department');
});

/**
 * @params sid
 * @params score
 * @params comment
 * @return Object {status: 'success'|'failed'}
 */
router.post('/rate', function(req, res){

});

/**
 * @return Interviewee
 */
router.get('/call', function (req, res){
    var department = req.session['did'];
});

module.exports = router;