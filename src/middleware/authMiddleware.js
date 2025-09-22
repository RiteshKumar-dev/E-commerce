const { verifyAccessToken } = require("../utils/token");
const { error } = require("../utils/response");
const status = require("../utils/statusCodes");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, status.UNAUTHORIZED, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return error(res, status.UNAUTHORIZED, "Invalid token", [err.message]);
  }
};
