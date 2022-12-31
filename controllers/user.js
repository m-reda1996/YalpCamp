const User = require("../models/user")

module.exports.renderRegister = (req, res) => {
  res.render("user/register")
}

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registerdUser = await User.register(user, password)
    req.login(registerdUser, (err) => {
      if (err) return next(err)
      req.flash("success", "welcome")
      res.redirect("/campground")
    })
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
}

module.exports.renderLogin = (req, res) => {
  res.render("user/login")
}
module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || "/campground"
  req.flash("success", "welcome back")
  // it faile and all redirect to campground   how to fix it
  // const redirectUrl = req.session[3] || '/campground'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(req.user, (err) => {
      if (err) return next(err)
      req.flash("success", "goodbye!")
      res.redirect("/campground")
    })
  }