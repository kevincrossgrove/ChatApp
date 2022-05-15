const mongoose = require("mongoose");

const convoSchema = new mongoose.Schema({
  users: { type: [String], required: true },
  messages: { type: [], required: false },
  visible: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", convoSchema);
