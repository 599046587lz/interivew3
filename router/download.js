const express = require('express'),
    path = require('path'),
    package = require('../modules/package');

var router = express.Router();

router.get('/:clubID', function (req, res) {

    let clubID = req.params.clubID;
    let file, filename;
    try {
        package.packing(clubID, function (err) {
            if (err) {
                throw err;
            }
            else {
                file = path.resolve(__dirname, '../files/' + clubID + '.zip');
                filename = clubID + '.zip';
                res.download(file, filename, function (err) {
                    if (err) throw err;
                });
            }
        });
    } catch (err) {
        cosole.log(err);
        res.send('打包失败，请重试！');
    }
});

module.exports = router;