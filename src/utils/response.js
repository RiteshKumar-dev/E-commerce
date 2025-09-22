const status = require("./statusCodes");

const success = (res, code = status.OK, message = "Success", data = {}) => {
  return res.status(code).json({ success: true, code, message, data });
};

const error = (
  res,
  code = status.INTERNAL_SERVER_ERROR,
  message = "Error",
  errors = []
) => {
  return res.status(code).json({ success: false, code, message, errors });
};

module.exports = { success, error };
