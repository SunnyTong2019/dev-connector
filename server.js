const express = require("express");
const authRoute = require("./routes/api/auth");
const profileRoute = require("./routes/api/profile");
const postsRoute = require("./routes/api/posts");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.listen(PORT, () => console.log("App is listening on port: " + PORT));
