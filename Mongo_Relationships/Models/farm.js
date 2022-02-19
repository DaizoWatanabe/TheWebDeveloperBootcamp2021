const mongoose = require("mongoose");
const {Schema} = mongoose;

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

  const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
      type: String,
      enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
  })

  const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product'}]
  })

 const Product = mongoose.model('Product', productSchema);
 const Farm = mongoose.model('Farm', farmSchema);

  // Product.insertMany([
  //   { name: 'Goddess Watermelon', price: 4.99, season: 'Summer'},
  //   { name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer'},
  //   { name: 'Asparagus', price: 3.99, season: 'Spring'}
  // ])


// const makeFarm = async () => {
//   const farm = new Farm({name: 'Full Belly Farms', city: 'Guianda, CA'});
//   const melon = await Product.findOne({name: 'Goddess Watermelon'});
//   farm.products.push(melon)
//   await farm.save();
//   console.log(farm)
// }

// makeFarm();

const addProduct = async () => {
  const farm = await Farm.findOne({name: 'Full Belly Farms'});
  const watermelon = await Product.findOne({name: 'Sugar Baby Watermelon'});
  farm.products.push(watermelon)
  await farm.save();
}

//addProduct();

Farm.findOne({name: 'Full Belly Farms'})
  .populate('products') //use populate method to fill the field based on the objectId it was stored
  .then(farm => console.log(farm));

// const dosomething = async () => {
//  const id = '620e496d260813e21545c105';
//  const res = await Farm.findByIdAndDelete(id)
//  res.save()
// }

// dosomething();
