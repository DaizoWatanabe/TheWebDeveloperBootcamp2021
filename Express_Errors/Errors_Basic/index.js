const express = require("express");
const morgan = require("morgan");
const AppError = require("./AppError");

const app = express();

app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

//not real way to require password, just example for protecting specific routes
const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "chickennugget") {
    next();
  }
  //res.send("SORRY YOU NEED A PASSWORD!");
  //below is a way to throw an error
  //throw new Error("SORRY YOU NEED A PASSWORD");
  throw new AppError("Password is required", 401);
};

app.use("/dogs", (req, res, next) => {
  console.log("This is a middleware set for /dogs");
  next();
});

app.get("/", (req, res) => {
  console.log(`Request Date: ${req.requestTime}`);
  res.send("Home Page");
});

app.get("/dogs", (req, res) => {
  res.send("WOOF WOOF");
});

app.get("/secret", verifyPassword, (req, res) => {
  res.send("You hoped there was a secret in here, sorry about that!");
});

//this is purposely setup to throw an error
app.get("/error", (req, res) => {
  chicken.fly();
});

app.get("/admin", (req, res) => {
  throw new AppError("You are not an admin", 403);
});

app.use((req, res, next) => {
  res.status(404).send("NOT FOUND - 404 ERROR");
});

// app.use((err, req, res, next) => {
//   console.log("*******************************");
//   console.log("**************ERROR************");
//   console.log("*******************************");
//   console.log(err);
//   next(err);
// });

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("App is running on localhost:3000");
});
