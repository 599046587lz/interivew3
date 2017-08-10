
let fs = require('fs');
let gm = require('gm').subClass({imageMagick: true});
let request = require('request');


exports.image_save = function(url, filename) {
    return new Promise(function(resolve, reject) {
        request.get(url).on('response', response => {
            response.pause();
            resolve(response);
        });
    }).then(response => {
        if(!fs.existsSync(__dirname + '/../files/image')) fs.mkdirSync(__dirname + '/../files/image');
        response.pipe(fs.createWriteStream('../files/image/' + filename));
        return '../files/image/' + filename;
    })
};