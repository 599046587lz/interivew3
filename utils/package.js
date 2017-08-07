const express = require('express'),
    createxcel = require('./excel'),
    creatword = require('./word'),
    db = require('../modules/student'),
    archiver = require('archiver'),
    fs = require('fs');

let wrap = fn => (...args) => fn(...args).catch(args[2]);

exports.packing = wrap(async function (clubID) {

    let dbdata, excel, word;
    dbdata = await db.queryByclubAll(clubID);
    excel = await createxcel.writeExcel(dbdata, clubID);
    for (let i of dbdata) {
        await creatword.writeWord(i);
    }

    let output = fs.createWriteStream('../files/' + clubID + '.zip');

    let archive = archiver('zip');

    output.on('close', function () {
        console.log('zip文件大小：' + archive.pointer());
        console.log('创建zip文件成功！');
    });

    archive.on('error', function (Error) {
        throw Error;
    });

    archive.pipe(output);
    archive.directory('../files/file/' + clubID + '/', false);
    archive.finalize();
});