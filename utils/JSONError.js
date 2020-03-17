let JSONError = function (message, status) {
    this.status = status || 500;
    this.message = message;
}

module.exports = JSONError;
