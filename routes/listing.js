const express = require("express");
const router = express.Router();
// wrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
// require listing model
const listing = require("../models/listing.js");
// calling middleware function
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
// require multer for file upload
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage});


// index route and creat route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.creatlisting));

// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);;

// show,update and delete route
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updatelisting))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deletelisting));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editlisting));

module.exports = router;

