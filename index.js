const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const BudgetUser = require("./models/BudgetUser");

const Transactions = require("./models/Transactions");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose
  .connect("mongodb+srv://mohini:mohinimohini@cluster0.sqdke.mongodb.net/test")
  .then(() => console.log("DB Connected"));

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.post("/addtrans", async (req, res) => {
  const { name, type, amount, date } = req.body;
  try {
    const newTrans = new Transactions({
      name,
      type,
      amount,
      date,
    });
    await newTrans.save();
    console.log(newTrans);

    return res.json(await newTrans.type);
  } catch (err) {
    console.log(err);
  }
});
app.get("/gettrans", async (req, res) => {
  try {
    return res.json(await Transactions.find());
  } catch (err) {
    console.log(err);
  }
});
app.post("/adduser", async (req, res) => {
  const { name, email, password, confirmpassword, pancard, phone } = req.body;

  try {
    const newUser = new BudgetUser({
      name,
      email,
      password,
      confirmpassword,
      pancard,
      phone,
    });
    await newUser.save();
    return res.status(200).json("User Registered Successfully");
  } catch (err) {
    console.log(err);
  }
});
app.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUser = await BudgetUser.findOne({ email });
    return await res.status(200).json(getUser);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});
