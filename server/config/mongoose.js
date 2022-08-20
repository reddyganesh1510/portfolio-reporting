const mongoose = require("mongoose");
const name = "PortfolioReportingDB";

const password = encodeURIComponent("ganesh");
const url = `mongodb+srv://ganesh:${password}@cluster1.nj2kq.mongodb.net/${name}?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,

  useUnifiedTopology: true,
};
const db = mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

module.exports = db;
