/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

router.post('/recommand', function (req, res){
    var interviewee = req.param('interviewee');
    var department = req.param('department');
});

router.post('/rate', function(req, res){

});

router.get('/call', function (req, res){

});

module.exports = router;