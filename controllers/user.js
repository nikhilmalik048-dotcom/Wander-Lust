const user = require("../models/user");
const listing = require("../models/listing.js");
const review = require("../models/review.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res,next)=>{
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
   
}

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login = async(req,res)=>{
    req.flash("success","Logged in successfully!");
    res.redirect(res.locals.redirectUrl || "/listing");
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listing");
    });
}