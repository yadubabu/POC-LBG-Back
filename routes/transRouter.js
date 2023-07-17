const express = require("express");
// const { Router } = require("express");
const Transactions = require("../models/Transactions");
const cors = require("cors");

const router = express.Router();
router.use(express.json());
router.use(
  cors({
    origin: "*",
  })
);
router.post("/addtrans", async (req, res) => {
  const { name, type, amount } = req.body;
  try {
    const newTrans = new Transactions({
      name,
      type,
      amount,
    });
    await newTrans.save();
    return res.json("Success");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
