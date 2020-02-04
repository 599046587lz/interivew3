// let JSONError = function (message, status) {
//     status = status || 500;
//     this.response.body = message;
//     this.response.status = status;
// };

const JSONError = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
    }
}

module.exports = JSONError;
