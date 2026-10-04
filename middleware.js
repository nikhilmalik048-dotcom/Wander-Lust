
const listing = require("./models/listing.js");
// require express error class
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()) {
         if (req.method === "GET") {
         req.session.redirectUrl = req.originalUrl;
     }
        req.flash("error", "You must be signed in to create a new listing.");
         return res.redirect("/login");
    }
    next(); 
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};

// valid schema from schema.js for server side validation in review route

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id);
    if (!foundlisting) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listing");
    }
    if (!foundlisting.owner || !foundlisting.owner.equals(req.user._id)) {
        req.flash("error", "you are not owner of this Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);
    if (!foundReview) {
        req.flash("error", "Cannot find that review!");
        return res.redirect(`/listing/${id}`);
    }
    if (!foundReview.author || !foundReview.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};