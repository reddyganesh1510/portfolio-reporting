const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello world");
});

router.use("/users", require("./user"));
router.use("/buy", require("./buy"));
router.use("/sell", require("./sell"));

router.use("/portfolio", require("./portfolio"));
router.use("/misc", require("./misc"));

module.exports = router;
