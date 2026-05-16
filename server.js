const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Schema
const UserSchema = new mongoose.Schema({
  userId: String,
  balance: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

// ================= ROOT =================
app.get("/", (req,res)=>{
  res.send("Backend Working");
});

// ================= USER =================
app.get("/user/:id", async (req,res)=>{
  let user = await User.findOne({ userId:req.params.id });

  if(!user){
    user = await User.create({ userId:req.params.id, balance:0 });
  }

  res.json(user);
});

// ================= MINE =================
app.post("/mine", async (req,res)=>{
  const { userId } = req.body;

  let user = await User.findOne({ userId });

  if(!user){
    user = await User.create({ userId, balance:0 });
  }

  user.balance += 1;
  await user.save();

  res.json({
    success:true,
    balance:user.balance
  });
});

// ================= WITHDRAW =================
app.post("/withdraw", async (req,res)=>{
  const { userId, wallet, amount } = req.body;

  res.json({
    success:true,
    message:"Withdraw request received"
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log("Server running on " + PORT);
});
