const excel = require('./excel'),
       word = require('./word');

exports.CreateWord = word.writeWord;
exports.CreateExcel = excel.writeExcel;