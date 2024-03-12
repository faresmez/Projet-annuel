const mongoose = require("mongoose");

const userDrawingsSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    pixel0: {
      type: Number,
      required: true,
    },
  },
  { strict: false }
);

const userDrawings = mongoose.model("user_drawings", userDrawingsSchema);

module.exports = userDrawings;
