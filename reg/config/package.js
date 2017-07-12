const express = require('express'),
    office = require('../office'),
    db = require('../db/student'),
    archiver = require('archiver'),
    fs = require('fs');


exports.packing = function (code,cb) {

    let dbdata, excel, word;

    (async () => {
        try {
            dbdata = await db.queryByclubAll(code);
            excel = await office.CreateExcel(dbdata, code);
            for (let i of dbdata) {
                await office.CreateWord(i);
            }

            let output = fs.createWriteStream('files/' + code + '.zip');

            let archive = archiver('zip');

            output.on('close', function () {
                console.log(archive.pointer() + 'total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                cb();
            });

            archive.on('error', function (err) {
                throw err;
            });

            archive.pipe(output);
            archive.directory('files/file/' + code + '/', false);
            archive.finalize();
        }catch(err)
            {
                cb(err);
            }
        }
        )();
};


// fs.mkdir('../files/file/' + code+'/', function (err) {
//
//     if (err) {
//         console.log(err);
//     }
//     else {
//     let dbdata;
//     (async () => {
//         dbdata = await db.queryByclubAll(code);
//     })();
//
//     let datacount;
//     (async () => {
//         datacount = await db.countByclub(code);
//     })();
//
//     if (dbdata && datacount) {
//
//         office.CreateExcel(dbdata);
//         //let excel = office.CreateExcel(dbdata);
//
//         for (let i = 0; i < datacount; ++i) {
//             office.CreateWord(dbdata[i]);
//         }
//     }
//
//     let output = fs.createWriteStream('files/' + code + '.zip');
//     let archive = archiver('zip');
//     output.on('close', function () {
//         console.log(archive.pointer() + ' total bytes');
//         console.log('archiver has been finalized and the output file descriptor has closed.');
//     });
//     archive.on('error', function (err) {
//         throw err;
//     });
//
//
//     archive.pipe(output);
//     archive.directory('files/file/' + code + '/', false);
//     archive.finalize();
//     // }});
// };