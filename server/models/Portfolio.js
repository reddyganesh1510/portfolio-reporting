const mongoose = require("mongoose");
const portfolioSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  coins: [{ name: String, quantity: Number, date: String, price: Number }],
});
module.exports = Portfolio = mongoose.model("portfolio", portfolioSchema);
