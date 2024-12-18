// server.js
require('dotenv').config(); 
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToOnlineDB  = require("./connections/connect");
const cors = require("cors");
const bodyParser = require('body-parser'); 

const userRoute = require("./routes/user");
const app = express();
const PORT = 8001;

connectToOnlineDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the portal");
});

app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Web Server Started at PORT:${PORT}`));