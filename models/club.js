/**
 * Created by bangbang93 on 14-9-16.
 */
var Club = require('../models').Club;
var debug = require('debug')('interview');


exports.login = function (user, pwd, callback){
    Club.findOne({
        name:user
    },'password', function(err, doc){
        if (err){
            return callback(err);
        } else {
            if (!!doc && doc.password == pwd){
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        }
    })
};

exports.getClubByName = function(name, callback){
    Club.findOne({
        name: name
    }, function (err, doc){
        if (err){
            return callback(err);
        } else {
            if (!!doc){
                doc = doc.toObject();
                delete doc.password;
                return callback(null, doc);
            } else {
                return callback(null, false);
            }
        }
    });
};

exports.getClubById = function(cid, callback){
    Club.findOne({
        cid: cid
    }, function (err, doc){
        if (err){
            return callback(err);
        } else {
            if (!!doc){
                delete doc.password;
                return callback(null, doc);
            } else {
                return callback(null, false);
            }
        }
    });
};

exports.update = function (cid, club, callback) {
    Club.update({
        cid: cid
    },club,function (err, numEffect) {
        callback(err);
    });
};