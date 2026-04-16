const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);