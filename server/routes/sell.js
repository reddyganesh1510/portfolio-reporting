const router = require("express").Router();
const Order = require("../models/Order");
const Portfolio = require("../models/Portfolio");

router.post("", async (req, res) => {
  try {
    const { email } = req.body;
    const coin = JSON.parse(req.body.coin);
    let user = await Portfolio.findOne({ email: email });

    if (user != null) {
      let stock = user.coins.find((o) => o.name === coin.name);

      let updatedStock = null;

      if (stock) {
        if (stock.quantity - Number(coin.quantity) < 0) {
          return res.status(500).send({
            message: "Not possible",
          });
        }
        let quantity = stock.quantity - Number(coin.quantity);
        let priceU = Number(stock.totalBuyValue) - Number(coin.totalBuyValue);
        // console.log(typeof priceU);
        updatedStock = await Portfolio.updateOne(
          { email: email, "coins.name": coin.name },
          {
            $set: {
              "coins.$.quantity": quantity,
              "coins.$.totalBuyValue": priceU,
            },
          }
        );
      }
      let order = await Order.create({
        stockName: coin.name,
        quantity: coin.quantity,
        price: coin.price,
        timestamp: coin.date,
        totalValue: coin.totalBuyValue,
      });
      let portfolio = await Portfolio.findOne({ email: email });
      return res.status(200).send({
        portfolio: portfolio,
        message: "Portfolio updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: error.message,
      message: "Records fetching unsuccessful",
    });
  }
});
module.exports = router;
