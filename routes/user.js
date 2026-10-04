const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
         const {username,email,password} = req.body;
    const newuser = new user({username,email});
    const registeredUser = await user.register(newuser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
         req.flash("success","Welcome to Wanderlust");
    res.redirect("/listing");
    });
   

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});


router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),async(req,res)=>{
    req.flash("success","Logged in successfully!");
    res.redirect(res.locals.redirectUrl || "/listing");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listing");
    });
});
module.exports = router;