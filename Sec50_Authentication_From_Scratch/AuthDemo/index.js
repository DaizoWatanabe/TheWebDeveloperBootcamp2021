const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

//db connection
mongoose
  .connect("mongodb://localhost:27017/authDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MOH NO, CONNECTION ERROR");
    console.log(err);
  });

//view engine and path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parse req.body
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

//homepage route
app.get("/", (req, res) => {
  res.send("THIS IS THE HOME PAGE");
});

//register get route
app.get("/register", (req, res) => {
  res.render("register");
});

//post register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

//login get route
app.get("/login", (req, res) => {
  res.render("login");
});

//post login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  //req.session.destroy();
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
