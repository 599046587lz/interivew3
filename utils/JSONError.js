let JSONError = function (message, status) {
    const err = new Error(message);
    err.status = status || 500;
    err.expose = true;
    throw err;
}

//     status = status || 500;
//     this.response.body = message;
//     this.response.status = status;
// };

// const JSONError = async (ctx, next) => {
//     const err = new Error("用户名或密码错误");
//     err.status = 403;
//     err.expose = true;
//     ctx.response.body = ctx.request.body;
//     throw err;
//     try {
//         await next();
//     } catch (err) {
//         ctx.response.status = err.statusCode || err.status || 500;
//         ctx.response.body = {
//             message: err.message
//         };
//     }
// }

module.exports = JSONError;
