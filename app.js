if(process.env.NODE_ENV !== "production"){
    // index.js
require('dotenv').config();

}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
// creating path for ejs
const path = require("path");
// method- override package
const methodOverride = require("method-override");
// ejs mate package foe creating templet
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// express session package
const session = require("express-session");
const MongoStore = require("connect-mongo").default;// flash package for flash messages
const flash = require("connect-flash");
// passport package for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");



const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");


// const MANGOOSE_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
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
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store:", err);
});
store.on("errors",()=>{
    console.log("Errors in MONGO SESSION STORE",err);
});
const sessionoptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 60 * 60 * 24 * 1000,
        maxAge: 7 * 60 * 60 * 24 * 1000
    },
};

// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// valid schema from schema.js for server side validation in listing route




app.use("/listing",listingsRoutes);
app.use("/listing/:id/reviews",reviewsRoutes);
app.use("/",userRoutes);




// for All errors handling code
app.all("/{*splat}", (req, res, next) => {
    console.log("404 hit:", req.method, req.originalUrl);
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    console.log("ERROR HANDLER:", err);
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("errors.ejs", { message });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});