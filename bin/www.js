#!/usr/bin/env node
// const debug = require('debug')('interview'),
const app = require('../app');

const port = process.env.PORT || '3001';
//app.set('port', process.env.PORT || 3001);
// app.set(port);
app.listen(port);

// let server = app.listen(app.get('port'), function() {
//   debug('Redhome interview server listening on port ' + server.address().port);
// });
// let io = require('socket.io')(server);
// io.on('connection', function (socket){
//     /**
//      * @params data {cid:cid}
//      */
//     socket.on('init', function(data){
//         if (!data['cid']){
//             socket.disconnect();
//         }
//         socket.join(data['cid']);
//     })
// });
// global.io = io;
