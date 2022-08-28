const router = require("express").Router();
const axios = require("axios");
const Stock = require("../models/Stock");

try {
  const stocks = [
    // "KACL",
    // "PQIF",
    // "SURJIND",
    // "SADHNA",
    // "GENSOL",
    // "IKAB",
    // "RADHEDE",
    // "CRESSAN",
    // "BLSINFOTE",
    // "RAJNISH",
    // "TCS",
    // "INFY",
    // "RELIANCE",
    // "HDFCBANK",
    // "ICICIBANK",
  ];
  async function stockret() {
    for await (let item of stocks) {
      // console.log(item);
      axios
        .get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item}.BSE&outputsize=full&apikey=2CGN629PVRGV7EEC`
        )
        .then(async (res) => {
          console.log(res.data);
          let dayWisePrices = [];
          for (const [key, value] of Object.entries(
            res.data["Time Series (Daily)"]
          )) {
            // dayWisePrices.push({
            //   timestamp: new Date(key),
            //   price: value["4. close"],
            // });
            let stockToBeAdded = await Stock.create({
              stockName: item,
              timestamp: new Date(key),
              price: value["4. close"],
            });
          }

          // console.log(stockToBeAdded);
        });
    }
  }
  stockret();
} catch (error) {
  console.log(error);
}

module.exports = router;
