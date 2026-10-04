const express = require("express");
const router = express.Router();
// wrapAsync function
const wrapAsync = require("../utils/wrapAsync.js");
// require listing model
const listing = require("../models/listing.js");
// calling middleware function
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");






// index route
router.get("/", async (req, res) => {
    let allListing = await listing.find({});

    console.log("ALL LISTINGS:");
    console.log(allListing);

    res.render("listing/index.ejs", { allListing });
});
// new route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listing/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
        const foundlisting = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", model: "User" }
        })
        .populate("owner");
    console.log(foundlisting);   // log foundlisting, NOT listing
    if(!foundlisting){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listing");
    }
    res.render("listing/show.ejs",{listing:foundlisting});
}));

// create listing
router.post("/", isLoggedIn,validateListing,
    wrapAsync(async (req, res) => {

        if (!req.body.listing.image || !req.body.listing.image.url) {
            req.body.listing.image = {
                filename: "default-image",
                url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
            };
        }

        const createlisting = new listing(req.body.listing);
        createlisting.owner = req.user._id;
        await createlisting.save();
        req.flash("success", "Successfully created a new listing!");

        res.redirect("/listing");
    })
);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const getlisting = await listing.findById(id);
    if(!getlisting){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listing");
    }
    res.render("listing/edit.ejs",{listing:getlisting});

}));
// update route
router.put("/:id", isLoggedIn, isOwner, validateListing,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listing/${id}`);
}));
//  for deleting  route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let  deletelistinge = await listing.findByIdAndDelete(id);
    console.log(deletelistinge);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listing");

}));

module.exports = router;