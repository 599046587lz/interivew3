
const express = require('express'),
      fs = require('fs'),
      request = require('request');

exports.qiniudownload = function qiniudownload(url,cb){
    let filename = Data.now()+'.jpg';
    request(url).pipe(fs.createWriteStream('files/image'+filename)).on('close',cb(err,res,filename));
};
      