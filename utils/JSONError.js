let JSONError = function (message, status) {
    status = status || 500;
    this.message = message;
    this.status = status;
};

module.exports = JSONError;