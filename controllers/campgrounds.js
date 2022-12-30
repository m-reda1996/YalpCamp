const Campground = require("../models/campground")

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
  console.log(files)
  const newCamp = new Campground(req.body.campground)
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
  console.log(req.body)
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  const imgs = req.files?.map((f) => ({url : f.path , filename : f.filename}))
  
  campground.images.push(...imgs)
  await campground.save()
  if(req.body.deleteImages){
    campground.updateOne({ filename : req.body.deleteImages})
    console.log(campground)
  }
  req.flash("success", "successuly update a camp ")
  res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params

  await Campground.findByIdAndDelete(id)
  req.flash("success", "deleted a camp")
  res.redirect(`/campground`)
}
