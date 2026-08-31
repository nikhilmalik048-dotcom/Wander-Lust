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

// sample listing model
// app.get("/testListing",async(req,res)=>{
//     const sampleListing = new listing({
//         title : "my new villa",
//         desecription : "by the beach",
//         price : 1200,
//         location : "Calangute,goa",
//         country : "india"
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// });

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
app.get("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    const foundlisting = await listing.findById(id);
    res.render("listing/show.ejs",{listing:foundlisting});
});

// creatlisting
app.post("/listing", async (req, res) => {
    console.log(req.body);

    const createlisting = new listing(req.body.listing);

    await createlisting.save();

    res.redirect("/listing");
});

// edit route
app.get("/listing/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const getlisting = await listing.findById(id);
    res.render("listing/edit.ejs",{listing:getlisting});

});
// update route
app.put("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
});
//  for deleting  route
app.delete("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let  deletelistinge = await listing.findByIdAndDelete(id);
    console.log(deletelistinge);
    res.redirect("/listing");

})


app.listen(8080,(req,res)=>{
    console.log("server is listening on port 8080");
});