const express = require("express")
const passport = require("passport")
const router = express.Router()
const CatchAsync = require("../utils/CatchAsync")
const user = require("../controllers/user")

const User = require("../models/user")

router.route("/register")
      .get(user.renderRegister)
      .post(CatchAsync(user.register))

router.route("/login")
      .get(user.renderLogin)
      .post(passport.authenticate("local", { failureFlash: true, keepSessionInfo: true, failureRedirect: "/login" }), user.login)

router.get("/logout", user.logout)


module.exports = router
