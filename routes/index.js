/**
 * Created by bangbang93 on 14-9-16.
 */
exports.checkLogin = function (req, res, next){
    if (!!req.session['cid']){
        next();
    } else {
        res.send(403, 'Require Login');
    }
};