const User = require("../models/User");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");
const { success, error } = require("../utils/response");
const status = require("../utils/statusCodes");

exports.register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });
    if (exists) {
      return error(res, status.CONFLICT, "User already exists");
    }

    const user = await User.create({ username, email, phone, password });

    return success(res, status.CREATED, "User registered", {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    return error(res, status.INTERNAL_SERVER_ERROR, "Registration failed", [
      err.message,
    ]);
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return error(res, status.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = createAccessToken({ userId: user._id });
    const refreshToken = createRefreshToken({ userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, status.OK, "Login successful", { accessToken });
  } catch (err) {
    return error(res, status.INTERNAL_SERVER_ERROR, "Login failed", [
      err.message,
    ]);
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return error(res, status.UNAUTHORIZED, "No refresh token");

    const decoded = verifyRefreshToken(token);
    const accessToken = createAccessToken({ userId: decoded.userId });

    return success(res, status.OK, "Token refreshed", { accessToken });
  } catch (err) {
    return error(res, status.UNAUTHORIZED, "Invalid refresh token", [
      err.message,
    ]);
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  return success(res, status.OK, "Logged out");
};
