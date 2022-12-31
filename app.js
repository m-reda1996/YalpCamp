if(process.env.NODE_ENV !== 'ALI') {
  require('dotenv').config()
}

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")
const methodOverride = require("method-override")
const passport = require("passport")
const localStrategy = require("passport-local").Strategy

mongoose.set("strictQuery", true)

const CatchAsync = require("./utils/CatchAsync")
const ExpressEroor = require("./utils/ExpressError")

const User = require("./models/user")
const Campground = require("./models/campground")

const userRoutes = require("./routes/user")
const campgroundRoutes = require("./routes/campground")
const reviewRoutes = require("./routes/review")

mongoose.connect("mongodb://localhost:27017/yalpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
const app = express()
app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("database connection")
})

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "view"))
app.use(express.static(path.join(__dirname, "public")))
const sessionConfig = {
  secret: "thisshooouasdfsdddfasd!!!!",
  resave: false,
  saveUninitialized: true,
  cookies: {
    httpOnly: true,
  },
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})
app.use("/", userRoutes)
app.use("/campground", campgroundRoutes)
app.use("/campground/:id/reviews", reviewRoutes)

app.get(
  "/",
  CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campground/index", { campgrounds })
  })
)

app.all(
  ("*",
  (req, res, next) => {
    next(new ExpressEroor("page not found ", 404))
  })
)

app.get("*", function (req, res, next) {
  next(new ExpressEroor("page not found ", 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "somthing went wrong" } = err
  if (!err.message) err.message = "oh no something went wrong"
  res.status(statusCode).render("error", { err })
})

app.listen(3000)
