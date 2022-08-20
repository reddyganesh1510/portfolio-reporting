const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello world");
});

router.use("/users", require("./user"));
router.use("/buy", require("./buy"));
router.use("/portfolio", require("./portfolio"));

module.exports = router;
