const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(PORT, () => console.log("App is listening on port: " + PORT));
