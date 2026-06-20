const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("database connected")
})
.catch ((err) => {
    console.log("connection failed")
});


app.get("/", (req,res) => {
    res.send("congratulation")
});

app.listen(4000, () => {
    console.log("backend is ready");    
});

