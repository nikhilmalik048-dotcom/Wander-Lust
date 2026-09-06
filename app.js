const express = require("express");
const app = express();
const mongoose = require("mongoose");
// require listing model
const listing = require("./models/listing.js");
// creating path for ejs
const path = require("path");
// method- override package
const methodOverride = require("method-override");
// ejs mate package foe creating templet
const ejsMate = require("ejs-mate");
// wrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");
// require express error class
const ExpressError = require("./utils/ExpressError.js");
// require schema for validation
const {listingSchema} = require("./schema.js");
// require review model
const Review = require("./models/review.js");
// require review schema for validation
const {reviewSchema} = require("./schema.js");


const MANGOOSE_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MANGOOSE_URL);
}

// set path for ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// to show path acess
app.use(express.urlencoded({ extended: true }));
// use method override
app.use(methodOverride("_method"));
// ejs mate packet use
app.engine("ejs",ejsMate);
// to use all static files of css
app.use(express.static(path.join(__dirname,"/public")));



app.get("/",(req,res)=>{
    res.send("hi i am root");
});



// valid schema from schema.js for server side validation in listing route

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};


// valid schema from schema.js for server side validation in review route

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};


// index route
app.get("/listing", async (req, res) => {
    let allListing = await listing.find({});

    console.log("ALL LISTINGS:");
    console.log(allListing);

    res.render("listing/index.ejs", { allListing });
});
// new route
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});

// show route
app.get("/listing/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const foundlisting = await listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{listing:foundlisting});
}));

// creatlisting
app.post("/listing",validateListing,
     wrapAsync(async (req, res,next) => {
        const createlisting = new listing(req.body.listing);
    await createlisting.save();
    res.redirect("/listing");

}));

// edit route
app.get("/listing/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const getlisting = await listing.findById(id);
    res.render("listing/edit.ejs",{listing:getlisting});

}));
// update route
app.put("/listing/:id",validateListing,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
     if(!req.body.listing){
            throw new ExpressError(400,"Invalid listing data");
        }
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));
//  for deleting  route
app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let  deletelistinge = await listing.findByIdAndDelete(id);
    console.log(deletelistinge);
    res.redirect("/listing");

}));


// review route post route
app.post("/listing/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    console.log("new review added");
    res.redirect(`/listing/${Listing._id}`);

}));

// delete review route
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));


// for All errors handling code
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err,req,res,next)=>{
     let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("errors.ejs",{message});
    // res.status(statusCode).send(message);

});


app.listen(8080,(req,res)=>{
    console.log("server is listening on port 8080");
});