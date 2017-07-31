const express = require('express'),
    createxcel = require('./excel'),
    creatword = require('./word'),
    db = require('./student'),
    archiver = require('archiver'),
    fs = require('fs');


exports.packing = function (clubID,cb) {

    let dbdata, excel, word;

    (async () => {
        try {
            dbdata = await db.queryByclubAll(clubID);
            excel = await createxcel.CreateExcel(dbdata, clubID);
            for (let i of dbdata) {
                await creatword.CreateWord(i);
            }

            let output = fs.createWriteStream('files/' + clubID + '.zip');

            let archive = archiver('zip');

            output.on('close', function () {
                console.log('zip文件大小：'+ archive.pointer());
                console.log('创建zip文件成功！');
            });

            archive.on('error', function (err) {
                throw err;
            });

            archive.pipe(output);
            archive.directory('files/file/' + clubID + '/', false);
            archive.finalize();
        }catch(err)
            {
                cb(err);
            }
        }
        )();
};