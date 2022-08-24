const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  stockName: { type: String },
  quantity: { type: Number },
  timestamp: { type: Date },
  price: { type: Number },
  totalValue: { type: Number },
});
module.exports = Order = mongoose.model("order", orderSchema);
