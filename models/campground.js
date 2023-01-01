const { string } = require("joi")
const mongoose = require("mongoose")
const Review = require("./review")

const Schema = mongoose.Schema




const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [{
    url : String,
    filename : String
  }],
  description: String,
  location: String,
  state: String,
  author: {
    type: Schema.Types.ObjectId,
    ref : "User"
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
})
// for delete the review when delete campground

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.review,
      },
    })
  }
})

module.exports = mongoose.model("Campground", CampgroundSchema)
