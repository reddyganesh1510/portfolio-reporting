const express = require("express");
const Stock = require("../models/Stock");
const Order = require("../models/Order");
const Portfolio = require("../models/Portfolio");
var createHTML = require("create-html");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "crce.8631.ce@gmail.com",
    pass: process.env.MAILER_PASSWORD,
  },
});
const QuickChart = require("quickchart-js");

const EmailMakerNewUser = async (html, emailId, username) => {
  var htmlToSend = html;

  // var template = await handlebars.compile(html);
  // var replacements = {
  //   username: username,
  //   email: emailId,
  //   password: password,
  // };
  // htmlToSend = await template(replacements);

  var mailOptions = {
    from: "crce.8631.ce@gmail.com",
    to: emailId,
    subject: "Your portfolio",

    html: htmlToSend,
  };
  //   console.log(process.env.MAIL_ID);
  transporter.sendMail(
    mailOptions,
    (err) => {
      if (err != null) {
        console.log(err);
      } else {
        console.log("New user mail sent to", username);
      }
    },
    (info) => {
      console.log(info);
    }
  );
};

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { document } = new JSDOM(`...`).window;
// const nodeHtmlToImage = require("node-html-to-image");
const { JSONToHTMLTable } = require("@kevincobain2000/json-to-html-table");

const router = express.Router();
router.get("/stock-names", async (req, res) => {
  try {
    let stocks = await Stock.distinct("stockName");
    return res.status(200).send({
      stocks: stocks,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/stock-price", async (req, res) => {
  try {
    let { name, date } = req.body;
    let stockPrice = await Stock.findOne({
      stockName: name,
      timestamp: new Date(date),
    });

    return res.status(200).send({
      stockPrice: stockPrice,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/stock-realtime-price", async (req, res) => {
  try {
    let { name } = req.body;
    console.log(name);
    let stockPrice = await Stock.findOne({
      stockName: name,
      timestamp: new Date("2022-08-26"),
    });
    console.log(stockPrice);

    return res.status(200).send({
      stockPrice: stockPrice,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/orders", async (req, res) => {
  try {
    let orders = await Order.find({}).sort({ timestamp: 1 });
    return res.status(200).send({
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
});

const getGraphUrl = (pieChartData) => {
  const PieChartQ = new QuickChart();

  PieChartQ.setConfig({
    type: "doughnut",
    data: pieChartData,
    options: {
      title: {
        display: true,
        text: "Holdings",
      },
    },
  })
    .setWidth(1500)
    .setHeight(700)
    .setBackgroundColor("transparent");

  // console.log(pieChartData.datasets[0].data);

  const pieChartImageUrl = PieChartQ.getUrl();
  // console.log(pieChartImageUrl);
  return pieChartImageUrl;
};

function random_bg_color() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var a = 0.5;
  var bgColor = "rgba(" + x + "," + y + "," + z + "," + a + ")";
  return bgColor;
}

let tableFromJson = async () => {
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
        // borderColor: [],

        // borderWidth: 1,
      },
    ],
  };

  // the json data.
  const portfolio = await Portfolio.findOne({
    email: "reddyganesh1510@gmail.com",
  });
  let contents = portfolio.coins.toObject();

  let totalPortfolioValue = 0;
  for await (let item of portfolio.coins) {
    let stockPrice = await Stock.findOne({
      stockName: item.name,
      timestamp: new Date("2022-08-26"),
    });
    // console.log(stockPrice.price);
    item.marketPrice = stockPrice.price;
    totalPortfolioValue =
      totalPortfolioValue + item.quantity * item.marketPrice;
  }

  for await (let item of contents) {
    // pieChartData.datasets[0].borderColor.push(color);

    let stockPrice = await Stock.findOne({
      stockName: item.name,
      timestamp: new Date("2022-08-26"),
    });

    // console.log(stockPrice.price);
    item.marketPrice = stockPrice.price;
    // totalPortfolioValue =
    //   totalPortfolioValue + item.quantity * item.marketPrice;
    pieChartData.labels.push(item.name);
    BarGraphData.labels.push(item.name);
    BarGraphData.datasets[0].data.push(item.totalBuyValue);
    BarGraphData.datasets[1].data.push(item.quantity * item.marketPrice);
    let perc = ((item.quantity * item.marketPrice) / totalPortfolioValue) * 100;

    pieChartData.datasets[0].data.push(perc);
    let color = random_bg_color();
    pieChartData.datasets[0].backgroundColor.push(color);
    // console.log(pieChartData);
  }

  const BarChartQ = new QuickChart();

  BarChartQ.setConfig({
    type: "bar",
    data: BarGraphData,
    options: {
      title: {
        display: true,
        text: "Comparision of values",
      },
    },
  })
    .setWidth(1500)
    .setHeight(700)
    .setBackgroundColor("transparent");

  const BarChartImageUrl = BarChartQ.getUrl();

  let PieUrl = getGraphUrl(pieChartData);

  let tableHtml = "";
  for (let item of contents) {
    // console.log(item);
    tableHtml =
      tableHtml +
      "<tr>" +
      "<td>" +
      item.name +
      "</td>" +
      "<td>" +
      item.quantity +
      "</td>" +
      "<td>" +
      item.marketPrice.toFixed(2) +
      "</td>" +
      "<td>" +
      (item.marketPrice * item.quantity).toFixed(2) +
      "</td>" +
      "<td>" +
      item.totalBuyValue.toFixed(2) +
      "</td>" +
      "<td>" +
      (item.marketPrice * item.quantity - item.totalBuyValue).toFixed(2) +
      "</td>" +
      "</tr>";
  }

  var html = createHTML({
    title: "Table - " + new Date().toUTCString(),
    scriptAsync: true,
    css: "",
    script: "",
    lang: "en",
    dir: "ltr",

    head:
      '<meta charset="utf-8">' +
      '<meta name="description" content="">' +
      '<meta name="author" content="">' +
      "<style>body{font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;width:100%;}td,th{border:1pxsolid#ddd;padding:8px;}th{padding-top:12px;padding-bottom:12px;text-align:left;background-color:#04AA6D;color:white;}</style>",

    body:
      '<main role="main" class="container">' +
      "</h1>" +
      '<table class="table table-hover">' +
      "<thead>" +
      //Add headers
      '<th scope="col">Stock</th>' +
      '<th scope="col">Quantity</th>' +
      '<th scope="col">Market Price</th>' +
      '<th scope="col">Current Value</th>' +
      '<th scope="col">Total Buy value</th>' +
      '<th scope="col">Gain</th>' +
      "</thead>" +
      "<tbody>" +
      //Add data to be displayed in the table
      tableHtml +
      "</tbody>" +
      "</table>" +
      "<span><img src=" +
      BarChartImageUrl +
      'alt="Girl in a jacket" width="500" height="300"></span>' +
      "<span><img src=" +
      PieUrl +
      'alt="Girl in a jacket" width="600" height="300"></span>' +
      "</main>",
  });
  // console.log(html);
  EmailMakerNewUser(html, "reddyganesh1510@gmail.com", "Ganesh");
};

router.get("/send-mail", (req, res) => {
  tableFromJson();
  return res.status(200).send({
    message: "success",
  });
});

module.exports = router;
