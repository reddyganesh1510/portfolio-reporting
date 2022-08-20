const Portfolio = require("../models/Portfolio");

const router = require("express").Router();

router.get("", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      email: "reddyganesh1510@gmail.com",
    });
    return res.send(200, {
      data: portfolio,
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
