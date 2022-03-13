const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

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

//statics is where we can define multiple methods that will be added to the User class itself,
//to the model, not to particular instances of User
//remember NOT to use arrow function since 'this' works differently
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//export model
module.exports = User = mongoose.model("User", userSchema);
