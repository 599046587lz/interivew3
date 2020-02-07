let JSONError = function (message, status) {
    const err = new Error(message);
    err.status = status || 500;
    err.expose = true;
    throw err;
}


module.exports = JSONError;
