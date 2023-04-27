const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // automatically redirect to the docs
  res.redirect("/docs");
});

module.exports = router;
