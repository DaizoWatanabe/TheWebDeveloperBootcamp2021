const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const randomPos = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const title = `${randomPos(descriptors)} ${randomPos(places)}`;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    // const image = "https://source.unsplash.com/collection/483251";
    const price = Math.floor(Math.random() * 20) + 10;
    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius tenetur saepe magnam quasi voluptatum, hic illum? Eos maiores delectus, qui cumque, praesentium consequuntur atque a quasi necessitatibus, quaerat saepe sed.';
    const camp = new Campground({
      title,
      location,
      price,
      description,
      author: '623f80292dde155e232b2ec8',
      images: [
        {
          url: "https://res.cloudinary.com/dh4pnu0ox/image/upload/v1648927983/YelpCamp/onc99ldycu72ivveijlv.jpg",
          filename: "YelpCamp/onc99ldycu72ivveijlv"
        },
        {
          url: "https://res.cloudinary.com/dh4pnu0ox/image/upload/v1648927983/YelpCamp/rdytfs6nvxvl6jxperrj.jpg",
          filename: "YelpCamp/rdytfs6nvxvl6jxperrj"
        }],
      geometry:
      {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      }
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

// const sample = array => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

// seedDB().then(() => {
//     mongoose.connection.close();
// })
