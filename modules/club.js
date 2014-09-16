/**
 * Created by bangbang93 on 14-9-16.
 */

var Club = require('../models/club');

exports.login = function (user, pwd, callback){
    Club.login(user, pwd, function (err, success){
        if (err){
            return callback(err);
        } else {
            return callback(null, success);
        }
    })
};

/**
 *
 * @param name
 * @param callback
 */
exports.getClubByName = function (name, callback){
    Club.getClubByName(name, function (err, club){
        if (err){
            return callback(err);
        } else {
            if (!!club){
                return callback(null, club);
            } else {
                return callback(null, false);
            }
        }
    })
};