const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("RefreshToken", schema);
