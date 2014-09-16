/**
 * Created by bangbang93 on 14-9-15.
 */
var express = require('express');
var router = express.Router();

/**
 * @params sid
 * @return Object {status: 'success'|'selectDep'}
 */
router.get('/sign', function(req, res){

});

/**
 * @params sid
 * @params did[]
 * @return Object {status: 'success'}
 */
router.post('/selectDep', function (req, res){

});

module.exports = router;