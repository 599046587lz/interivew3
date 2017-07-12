
const pack = require('./package'),
      upload = require('./upload');

exports.pack = pack.packing;
exports.upload = upload.fileupload;
exports.fileFileter = upload.fileFileter;
