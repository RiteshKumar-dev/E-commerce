const { error } = require("../utils/response");
const status = require("../utils/statusCodes");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return error(res, status.INTERNAL_SERVER_ERROR, "Server error", [
    err.message,
  ]);
};

module.exports = errorHandler;
