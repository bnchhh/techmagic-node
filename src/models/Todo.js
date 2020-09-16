const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  completed: { type: Boolean, default: false },
});

module.exports = model("Todo", schema);
