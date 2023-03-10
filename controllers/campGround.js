const { cloudinary } = require("../cloudinary")
const Campground = require("../models/campGround")
const mbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN

const geoCoder =  mbGeocoding({accessToken : mapBoxToken})

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
}
module.exports.renderForm = (req, res) => {
  res.render("campground/new")
}

module.exports.createCamp = async (req, res, next) => {

  // if(!req.body.campground) throw new ExpressEroor(' invalid ')
  const files = req.files
 const geoData = await geoCoder.forwardGeocode({
     query : req.body.campground.location,
     limit : 1
  }).send() 
  const newCamp = new Campground(req.body.campground)
  newCamp.geometry = geoData.body.features[0].geometry
  newCamp.images = req.files?.map((f) => ({ url: f.path, filename: f.filename }))
  newCamp.author = req.user._id
  await newCamp.save()
  console.log(newCamp)

  req.flash("success", "successuly made a new camp ")
  res.redirect(`/campground/${newCamp._id}`)
}

module.exports.showCamp = async (req, res) => {
  const { id } = req.params

  //ex ==  populate author to show all date in this author in dbs not show only id
  //ex ==  populate review to show all date in this review in dbs not show only id

  const campground = await Campground.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("author")
    .populate("images")
  if (!campground) {
    req.flash("error", "can not find camp ")
    return res.redirect("/campground")
  }
  res.render("campground/show", { campground })
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash("error", "can not find camp ")
    return res.redirect("/campground")
  }

  res.render("campground/edit", { campground })
}

module.exports.updateCamp = async (req, res) => {
  const { id } = req.params

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  if(req.body.deleteImages){
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }}
  req.body.deleteImages?.forEach(async(deleteImage) => {
    const index = campground.images.findIndex(i => i.filename === deleteImage)
    campground.images.splice(index, 1)
  })


  req.files?.forEach((f) => {
    campground.images.push({ url: f.path, filename: f.filename })
  })


  await campground.save()
  req.flash("success", "successuly update a camp ")
  res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params

  await Campground.findByIdAndDelete(id)
  req.flash("success", "deleted a camp")
  res.redirect(`/campground`)
}
