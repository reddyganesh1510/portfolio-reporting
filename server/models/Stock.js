const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
  stockName: { type: String },
  prices: [{ timestamp: { type: Date }, price: { type: Number } }],
});
module.exports = stock = mongoose.model("stock", stockSchema);
