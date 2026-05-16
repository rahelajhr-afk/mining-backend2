const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB URL (এখানে তোমার Atlas URI বসাবে)
const MONGO_URI = "mongodb://atlas-sql-6a0810912535ffb6f8c80cc7-x21yg9.a.query.mongodb.net/miningpay2?ssl=true&authSource=admin";

// connect DB
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 📦 User Schema
const userSchema = new mongoose.Schema({
  userId: String,
  balance: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// ➕ Get user
app.get("/user/:id", async (req, res) => {
  let user = await User.findOne({ userId: req.params.id });

  if (!user) {
    user = await User.create({ userId: req.params.id });
  }

  res.json(user);
});

// ⛏ Mining (balance increase)
app.post("/mine", async (req, res) => {
  const { userId } = req.body;

  let user = await User.findOne({ userId });

  if (!user) {
    user = await User.create({ userId });
  }

  user.balance += 1;
  await user.save();

  res.json({ success: true, balance: user.balance });
});

// 💰 Withdraw request (dummy)
app.post("/withdraw", async (req, res) => {
  const { userId, amount } = req.body;

  res.json({
    success: true,
    message: `Withdraw request received for ${amount}`
  });
});

// 🚀 server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
