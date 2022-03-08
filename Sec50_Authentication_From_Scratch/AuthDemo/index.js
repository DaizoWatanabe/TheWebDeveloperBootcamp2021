const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hash });
  await user.save();
  res.redirect("/");
});

//login get route
app.get("/login", (req, res) => {
  res.render("login");
});

//post login route
app.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username})
  if(!user) {'Incorrect username or password'}
  const validPassword = await bcrypt.compare(password, user.password)
  if(validPassword) {res.send('WELCOME!')}
  else {res.send('Try again')}
});

app.get("/secret", (req, res) => {
  res.send("THIS IS SECRET! YOU CANNOT SEE ME IF YOU ARE NOT LOGGED IN");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
