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
const {validateReview, isLoggedIn} = require("../middleware.js");   



// review route post route
router.post("/",isLoggedIn, validateReview,wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    console.log("new review added");
    req.flash("success", " created a new review!");
    res.redirect(`/listing/${Listing._id}`);

}));

// delete review route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "deleted the review!");
    res.redirect(`/listing/${id}`);
}));

module.exports =router;
