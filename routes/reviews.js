const express = require("express");
const router = express.Router({ mergeParams: true});
// wrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
// require express error class
const ExpressError = require("../utils/ExpressError.js");
// require review model
const Review = require("../models/review.js");
// require listing model
const listing = require("../models/listing.js");
// calling middleware function
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js"); 
const reviewController = require("../controllers/review.js");   



// review route post route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createreview));

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deletereview));

module.exports =router;
