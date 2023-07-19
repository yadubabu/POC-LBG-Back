const express = require("express");
// const { Router } = require("express");
const Transactions = require("../models/Transactions");
const cors = require("cors");
const _ = require("lodash");
const TransactionsTrack = require("../models/TransactionsTrack");

const transRouter = express.Router();
transRouter.use(express.json());
transRouter.use(
  cors({
    origin: "*",
  })
);
transRouter.get("/", async (req, res) => {
  return res.send(await TransactionsTrack.find());
});
transRouter.post("/", async (req, res) => {
  console.log(req.body);
  const { name, type, amount, date } = req.body;

  try {
    const newTrans = new Transactions({
      name,
      type,
      amount,
      date,
    });

    await newTrans.save();

    if (newTrans.type === "savings") {
      const getTotals = await TransactionsTrack.find();
      return await TransactionsTrack.findByIdAndUpdate(
        getTotals[0]._id.toString(),
        {
          totAmount: _.sum([getTotals.totAmount, newTrans.amount]),
          totSavings: _.sum([newTrans.amount, getTotals[0].totSavings]),
        }
      );
    }
    if (newTrans.type === "expense") {
      const getTotals = await TransactionsTrack.find();
      console.log(getTotals[0]);
      return await TransactionsTrack.findByIdAndUpdate(
        getTotals[0]._id.toString(),
        {
          totAmount: _.subtract([getTotals[0].totAmount, newTrans.amount]),
          totExpense: _.sum([newTrans.amount, getTotals[0].totExpense]),
        }
      );
    }
    if (newTrans.type === "investment") {
      const getTotals = await TransactionsTrack.find();
      return await TransactionsTrack.findByIdAndUpdate(
        getTotals[0]._id.toString(),
        {
          totAmount: _.subtract([getTotals[0].totAmount, newTrans.amount]),
          totInvestment: _.sum([newTrans.amount, getTotals[0].totInvestment]),
        }
      );
    }
    return res.json(newTrans);
  } catch (err) {
    console.log(err);
  }
});
transRouter.get("/", async (req, res) => {
  try {
    return res.json(await Transactions.find());
  } catch (err) {
    console.log(err);
  }
});

module.exports = transRouter;
