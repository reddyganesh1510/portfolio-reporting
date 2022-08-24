const Order = require("../models/Order");
const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

const router = require("express").Router();

router.get("", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      email: "reddyganesh1510@gmail.com",
    });

    const orders = await Order.find({});
    const stocks = await Stock.find({});
    return res.send(200, {
      data: portfolio,
      stockHistory: stocks,
      orders: orders,
      message: "Portoflio retrieved successfully",
    });
  } catch (error) {
    res.send(500, {
      error: error.message,
      message: "Portfolio fetch unsuccessful",
    });
  }
});

module.exports = router;
