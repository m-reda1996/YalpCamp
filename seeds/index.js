const mongoose = require("mongoose")
mongoose.set("strictQuery", true)
const cities = require("./cities")
const { descriptors, places } = require("./seendHelpers")

const Campground = require("../models/campground")
mongoose.connect("mongodb://localhost:27017/yalpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))

db.once("open", () => {
  console.log("database connection")
})
const simple = (array) => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 70; i++) {
    const random100 = Math.floor(Math.random() * 100)
    const price = Math.floor(Math.random() * 20) + 11
    const camp = new Campground({
      location: `${cities[random100]?.city} `,
      state: `${cities[random100]?.state} `,
      author: "63ad5442d1bcdc557647ed53",
      title: `${simple(descriptors)} ${simple(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores incidunt labore veniam iure assumenda quia voluptate quae neque, quisquam accusamus, hic consectetur reiciendis, exercitationem doloribus non deleniti tenetur dolorum sed eius voluptatibus odio. Rem nobis, earum sapiente suscipit excepturi eaque?",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dxhmlftsm/image/upload/v1672414736/YalpCamp/fdwvhwq7cuhiir7wej0q.jpg",
          filename: "YalpCamp/fdwvhwq7cuhiir7wej0q"
        },
      ],
    })
    await camp.save()
  }
}
seedDB().then(() => {
  mongoose.connection.close()
})
