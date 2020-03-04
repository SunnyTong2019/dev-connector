const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");
const authRoute = require("./routes/api/auth");
const userRoute = require("./routes/api/user");
const profileRoute = require("./routes/api/profile");
const postsRoute = require("./routes/api/posts");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  err => {
    if (err) {
      console.log(err.message);
      // Exit process with failure
      process.exit(1);
    }
    console.log("DB connected....");
  }
);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.listen(PORT, () => console.log("App is listening on port: " + PORT));
