const express = require("express")
const campgrounds = require("../controllers/campGround")
const CatchAsync = require("../utils/CatchAsync")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
const {  cloudinary,storage}  = require('../cloudinary/index')
const multer  = require('multer')
const upload = multer({ storage })

const router = express.Router()

router.route("/")
    .get(CatchAsync(campgrounds.index))
    .post( isLoggedIn,upload.array('image'),validateCampground, CatchAsync(campgrounds.createCamp))
    // .post(upload.array('image'),(req,res )=>{
    // console.log(req.body,req.files)
    // res.send('done')
    // })

router.get("/new", isLoggedIn, CatchAsync(campgrounds.renderForm))

router.route("/:id")
        .get( CatchAsync(campgrounds.showCamp))
        .put( isLoggedIn, isAuthor,upload.array('image'), validateCampground, CatchAsync(campgrounds.updateCamp))
        .delete( isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCamp))

         router.get("/:id/edit", isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm))
module.exports = router
