const mongoose = require("mongoose");
const { Schema } = mongoose;

//define Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank"],
  },
});

//export model
module.exports = mongoose.model("User", userSchema);
