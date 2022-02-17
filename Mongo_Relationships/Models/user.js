//this is the best way to store a relationship of ONE TO FEW
//there are some limitations to this, specially when it comes to one to many, should be mentioned on video 452.
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION STARTED");
  })
  .catch((err) => {
    console.log("OH NO, MONGO CONNECTION FAILED!!!");
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    {
    //_id: {id: false} since the array is treated as an embedded schema you can turn the id off  
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
  const u = new User({
    first: "Harry",
    last: "Potter",
  });
  u.addresses.push({
    street: "123 sesame street",
    city: "New York",
    state: "New York",
    country: "USA",
  });
  const res = await u.save();
  console.log(res);
};

//another way to add an address to the user is down below:
//if we break it into steps would be:
//1. find something by id
//2. push it into the array
//3. save it
const addAddress = async (id) => {
  const user = await User.findById(id);
  user.addresses.push(
    {
      street: "456 3rd street",
      city: "New York",
      state: "New York",
      country: "USA",
    }
  )
  const res = await user.save();
  console.log(res)
}

addAddress('620c04bb6cf412646c2f23e9')

//makeUser();
