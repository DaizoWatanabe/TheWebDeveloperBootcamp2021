const mongoose = require("mongoose");
const Product = require("./product");
const { Schema } = mongoose;

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm must have a name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

//findByIdAndDelete is the same as findOneAndDelete({id: id})
//the .post method is used because after you use the findByIdAndDelete it stores the "data"
//with the data passed thru we can use deleteMany to erase w/e is linked to the object, in this case the products of the farm
//the mongo $in operator does the 'filter' of w/e it is in will be included in w/e we set to do
//down below we delete w/e is in w/e we set
farmSchema.post("findOneAndDelete", async function (farm) {
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
  }
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
