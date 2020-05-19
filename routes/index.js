var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");


var Campground = require("../models/campground");
var User = require("../models/user");
var Comment = require("../models/comments");

var passport = require("passport");


router.get("/",function(req,res){
    
   res.render("landing", { currentUser: req.user});
});




//=====================================
// AUTH ROUTES
//=====================================

router.get("/register", function(req,res){
    
   res.render("register", { currentUser: req.user}); 
});

router.post("/register", function(req,res){
    
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       
       if(err){
           req.flash("error",err.message);
           console.log(err);
           res.render("register", { currentUser: req.user});
       }
       else{
           passport.authenticate("local")(req,res, function(){
              req.flash("success","You have registered successfully. Welcome to Yelp Camp "+ user.username);
              res.redirect("/campgrounds"); 
           });
       }
   });
});

router.get("/login", function(req,res){
    
   res.render("login", { currentUser: req.user,}); 
});

router.post("/login", passport.authenticate("local",{
        
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "You have logged in successfully. Welcome to Yelp Camp!"

}), function(req, res){
    
});

router.get("/logout", function(req,res){
    
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});



module.exports = router;