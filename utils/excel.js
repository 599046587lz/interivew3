const express = require('express'),
    xlsx = require('xlsx'),
    fs = require('fs'),
    path = require('path');


exports.writeExcel = function (dbdata, clubID) {
    try {

        let _headers = ['_id', 'clubID', 'club', 'name', 'studentID', 'gender', 'major', 'department', 'intro', 'tel', 'qq', 'short_tel'];

        let _data = dbdata;

        let headers = _headers
            .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65 + i) + 1}))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

        let data = _data
            .map((v, i) => _headers.map((k, j) => Object.assign({}, {
                v: v[k],
                position: String.fromCharCode(65 + j) + (i + 2)
            })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

        let newheader = {
            A1: {v: 'id'},
            B1: {v: '社团代号'},
            C1: {v: '社团'},
            D1: {v: '姓名'},
            E1: {v: '学号'},
            F1: {v: '性别'},
            G1: {v: '专业'},
            H1: {v: '部门'},
            I1: {v: '简介'},
            J1: {v: '手机号'},
            K1: {v: 'qq'},
            L1: {v: '短号'}
        };

        let output = Object.assign({}, newheader, data);

        let outputPos = Object.keys(output);

        let ref = outputPos[0] + ":" + outputPos[outputPos.length - 1];

        let wb = {
            SheetNames: ['Sheet1'],
            Sheets: {
                'Sheet1': Object.assign({}, output, {"!ref": ref})
            }
        };
        xlsx.writeFile(wb, '../files/file/' + clubID + '/data.xlsx');
    }catch(Error){
        throw Error;
    }
};
