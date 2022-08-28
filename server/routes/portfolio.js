const Order = require("../models/Order");
const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

const router = require("express").Router();

const priceComparisonBarChart = (orders) => {
  for (let item of orders) {
  }
};

router.get("", async (req, res) => {
  try {
    const orders = await Order.find({});

    const portfolio = await Portfolio.findOne({
      email: "reddyganesh1510@gmail.com",
    });

    function random_bg_color() {
      var x = Math.floor(Math.random() * 256);
      var y = Math.floor(Math.random() * 256);
      var z = Math.floor(Math.random() * 256);
      var a = 0.5;
      var bgColor = "rgba(" + x + "," + y + "," + z + "," + a + ")";
      return bgColor;
    }

    // const stocks = await Stock.find({});
    let totalPortfolioValue = 0;
    for (let item of portfolio.coins) {
      let stockPrice = await Stock.findOne({
        stockName: item.name,
        timestamp: new Date("2022-08-26"),
      });
      // console.log(stockPrice.price);
      item.marketPrice = stockPrice.price;
      totalPortfolioValue =
        totalPortfolioValue + item.quantity * item.marketPrice;
    }

    let BarGraphData = {
      labels: [],
      datasets: [
        {
          label: "Buy Value",
          data: [],
          backgroundColor: random_bg_color(),
        },
        {
          label: "Current Value",
          data: [],
          backgroundColor: random_bg_color(),
        },
      ],
    };
    let pieChartData = {
      labels: [],

      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: [],

          borderWidth: 1,
        },
      ],
    };
    for (let item of portfolio.coins) {
      // console.log(stockPrice.price);
      pieChartData.labels.push(item.name);
      BarGraphData.labels.push(item.name);
      BarGraphData.datasets[0].data.push(item.totalBuyValue);
      BarGraphData.datasets[1].data.push(item.quantity * item.marketPrice);
      let perc =
        ((item.quantity * item.marketPrice) / totalPortfolioValue) * 100;
      item.percentageOfPortfolio = perc;

      pieChartData.datasets[0].data.push(perc);
      let color = random_bg_color();
      pieChartData.datasets[0].backgroundColor.push(color);
      pieChartData.datasets[0].borderColor.push(color);
    }

    return res.send(200, {
      data: portfolio,
      pieChartData: pieChartData,
      BarGraphData: BarGraphData,
      orders: orders,
      message: "Portoflio retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.send(500, {
      error: error.message,
      message: "Portfolio fetch unsuccessful",
    });
  }
});

module.exports = router;
