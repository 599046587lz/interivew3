/**
 * Created by bangbang93 on 14-9-16.
 */
var Club = require('../models').Club;

exports.login = function (user, pwd, callback){
    Club.find({
        name:user
    },'password', function(err, doc){
        if (err){
            return process.nextTick(callback(err));
        } else {
            if (doc.pwd == pwd){
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        }
    })
};

exports.getClubByName = function(name, callback){
    Club.find({
        name: name
    }, function (err, doc){
        if (err){
            return callback(err);
        } else {
            if (!!doc){
                return callback(null, doc);
            } else {
                return callback(null, false);
            }
        }
    });
};