const express = require("express");
const app = express();
const shelterRouter = require("./routes/shelters");
const dogRouter = require("./routes/dogs");

app.use("/shelter", shelterRouter);
app.use("/dogs", dogRouter);

app.listen(3000, () => {
  console.log("Serving app on localhost:3000");
});
