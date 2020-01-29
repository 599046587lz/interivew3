let JSONError = function (message, status) {
    status = status || 500;
    this.response.body = message;
    this.response.status = status;
};

module.exports = JSONError;
