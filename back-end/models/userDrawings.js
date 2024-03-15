const mongoose = require("mongoose");

const userDrawingsSchema = new mongoose.Schema({
  pixels: [Number],
  resultat: [String]
}, 
{ timestamps: true }); 

const userDrawings = mongoose.model("user_drawings", userDrawingsSchema);

module.exports = userDrawings;
