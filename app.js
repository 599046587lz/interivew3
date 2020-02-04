const koa = require('koa');
const path = require('path');
//const proxy = require('http-proxy-middleware');  //代理
const proxy =require('koa2-proxy');
//const favicon = require('static-favicon');      //静态图标
const logger = require('koa-logger');
// const cookieParser = require('cookie-parser');   //加密
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const koaStatic = require('koa-static');
const session = require('koa-session');


const club = require('./router/club');
const interview = require('./router/interview');
const room = require('./router/room');
const common = require('./router/common');
const reg = require('./router/reg');

const mid = require('./utils/middleware');
const config = require('./config');
const utils = require('./utils/utils');

const app = new koa();
//const router = require('koa-router')();

//const serve = require('koa-static');
//const render = require('koa-ejs');

utils.saveDb();
app.keys = [config.koaKeys];
app.use(session(app));

app.use(koaStatic(__dirname + '/public'));
// if (process.env.ENABLE_PROXY) {
//     app.use(proxy({ target: config.proxy, changeOrigin: true }))
// }
if (process.env.ENABLE_PROXY) {
    app.use(proxy({ target: config.proxy, changeOrigin: true }))
}

//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser({
    enableTypes:['json', 'form', 'text']
}))
//app.use(bodyParser.json());
app.use(json());
app.use(logger());

app.use(common.routes());
app.use(club.routes());
app.use(interview.routes());
app.use(reg.routes());
app.use(room.routes());

app.use(async function(ctx, next) {
    try { await next()
    } catch (err) { console.log(err) }
});

module.exports = app;
// app.use(cookieParser());
//app.use(favicon());
// if(config.environment === 'debug'){
//     //app.use(logger('dev'));
//     app.use(async (ctx, next) => {
//         console.log('dev')
//     })
// }

// app.all('*', function(req, res, next) {//允许全部跨域
//
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization,'Origin',Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Content-Type", "application/json;charset=utf-8");
//     //console.log('------')
//     next();
// });

// app.use(async(ctx,next) =>{
//     await next();
// })
//
// app.use(mid.session());
// //报名系统公共入口（不需登录）
// //app.use('/common', common);
// router.get('/common',async(ctx,next)=>{
//     ctx.response.body = common;
// })
// //app.use('/reg',reg);
// router.get('/reg',async(ctx,next)=>{
//     ctx.response.body = reg;
// })
//
//
// //进行是否登录的鉴定
//app.use(mid.checkLogin)
// //app.use('/club', club);
// router.get('/club',async(ctx,next)=>{
//     ctx.response.body = club;
// })
// //app.use('/interview', interview);
// router.get('/interview',async(ctx,next)=>{
//     ctx.response.body = interview;
// })
// //app.use('/room', room);
// router.get('/room',async(ctx,next)=>{
//     ctx.response.body = room;
//
//
// //catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
//
// // production error handler
// // no stacktraces leaked to user
//
// app.use(function(err, req, res, next) {
//     console.log(err);
//     res.status(err.status || 500);
//     res.send(err);
// });

// app.use(async(ctx,next)=>{
//     console.log(err);
//     await next();
//     if(ctx.status === 500){
//         ctx=err;
//     }
// });


