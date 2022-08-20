const router = require("express").Router();
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
        let quantity = stock.quantity + Number(coin.quantity);
        updatedStock = await Portfolio.updateOne(
          { email: email, "coins.name": coin.name },
          { $set: { "coins.$.quantity": quantity } }
        );
      } else {
        updatedStock = await Portfolio.updateOne(
          { email: email },
          {
            $push: {
              coins: coin,
            },
          }
        );
      }
      let portfolio = await Portfolio.findOne({ email: email });
      return res.status(200).send({
        portfolio: portfolio,
        message: "Portfolio updated successfully",
      });
    } else {
      var new_user = new Portfolio({
        email: email,
        name: "Ganesh",
      });

      new_user.coins.push(coin);
      new_user.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            error: err.message,
            message: "Records fetching unsuccessful",
          });
        } else {
          return res.status(200).send({
            portfolio: new_user,
            message: "Portfolio created successfully",
          });
        }
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
