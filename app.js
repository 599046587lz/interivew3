const Koa = require('koa');
const proxy =require('koa2-proxy');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const koaStatic = require('koa-static');
const session = require('koa-session');

const club = require('./router/club');
const interview = require('./router/interview');
const room = require('./router/room');
const common = require('./router/common');
const reg = require('./router/reg');

const config = require('./config');
const mid = require('./utils/middleware');
const JSONError = require('./utils/JSONError');
const utils = require('./utils/utils');

const app = new Koa();

app.use(async function(ctx, next) {
    try {
        await next()
    } catch (err) {
        console.log(err)
        if(err instanceof JSONError){
            ctx.response.status = err.status;
            ctx.response.body = err.message;
        } else {
            ctx.response.status = 500;
        }
    }
});

utils.saveDb();
app.keys = [config.koaKeys];
app.use(session(app));

app.use(koaStatic(__dirname + '/public'));

if (process.env.ENABLE_PROXY) {
    app.use(proxy({ target: config.proxy, changeOrigin: true }))
}

app.use(bodyParser({
    enableTypes:['json', 'form', 'text']
}));

if(config.environment !== 'dev'){
    app.use(logger());
}

//报名系统公共入口（不需登录）
app.use(common.routes());
app.use(reg.routes());
//进行是否登录的鉴定
app.use(mid.checkLogin);
app.use(club.routes());
app.use(interview.routes());
app.use(room.routes());

module.exports = app;
