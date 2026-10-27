const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createreview = async(req,res)=>{
    let foundListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    console.log("new review added");
    req.flash("success", "created a new review!");
    res.redirect(`/listing/${foundListing._id}`);
}

module.exports.deletereview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "deleted the review!");
    res.redirect(`/listing/${id}`);
}