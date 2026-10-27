
const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let allListing = await listing.find({});

    console.log("ALL LISTINGS:");
console.dir(allListing, { depth: null });

    res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}


module.exports.showListing =async(req,res)=>{
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
}

module.exports.creatlisting = async (req, res) => {


  let response = await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
 












    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);

        const newlisting = new listing(req.body.listing);
        newlisting.image = { url, filename };
        newlisting.owner = req.user._id;
        newlisting.geometry = response.body.features[0].geometry;
        let savedListing = await newlisting.save();
       console.dir(savedListing.geometry, { depth: null });
        req.flash("success", "Successfully created a new listing!");

        res.redirect("/listing");
    }


  
module.exports.editlisting = async (req, res) => {
    let { id } = req.params;

    const getlisting = await listing.findById(id);

    if (!getlisting) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listing");
    }

    let originalImageUrl = getlisting.image.url;
    originalImageUrl = originalImageUrl.replace(
        "upload",
        "/upload/h_300,w_250"
    );

    res.render("listing/edit.ejs", {
        listing: getlisting,
        originalImageUrl
    });
};


   module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listing/${id}`);
};

module.exports.deletelisting = async (req,res)=>{
    let {id} = req.params;
    let  deletelistinge = await listing.findByIdAndDelete(id);
    console.log(deletelistinge);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listing");

}