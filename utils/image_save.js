
const fs = require('fs'),
      //gm = require('gm').subClass({imageMagick: true}),
      request = require('request');

exports.image_save = function image_save(url,filename,newfilename){

    (async () => {
        try {
           await request(url).on('error', err => {throw (err)}).pipe(fs.createWriteStream('../files/image/' + filename));

           //  setTimeout(
           //      function(){
           //     gm('../files/image/' + filename).resize(240, 240, '!').write('../files/image/' + newfilename,function(err){
           //      if(err)throw err;
           // }
           // )},5000);
        }catch(err){
             console.log(err);
        }
    })();
};
      