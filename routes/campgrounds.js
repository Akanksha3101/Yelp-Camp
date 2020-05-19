var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var Comment = require("../models/comments");


router.get("/campgrounds", function(req,res){
      
       Campground.find({},function(err,campgrounds){
           
          if(err){
              req.flash("error","Something went wrong!")
              console.log(err);
          } 
          else{
              
              res.render('./campgrounds/campgrounds', {campgrounds:campgrounds, currentUser: req.user});
          }
       });

});


router.post("/campgrounds", isLoggedIn, function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
            id: req.user._id,
            username: req.user.username
        }
    var price = req.body.price;
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author,
        price: price
    };
    Campground.create(newCampground,function(err,campground){
        
        if(err){
            req.flash("error","Campground could not be created!");
            console.log(err);
        }
        else{
            req.flash("success","Campground created successfully!");
            res.redirect("/campgrounds");
        }
    })
}); 

router.get("/campgrounds/new", isLoggedIn, function(req,res){
    
    res.render("./campgrounds/form", { currentUser: req.user});    
});




router.get("/campgrounds/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Something went wrongd!");
            console.log(err);
        }
        else
        {
            res.render("./campgrounds/show", {campground : foundCampground,  currentUser: req.user});
        }
       
   });
    
});


router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req,res){
            Campground.findById(req.params.id, function(err, campground){
                if(err || !campground)
                {
                    res.redirect("/campgrounds/"+req.params.id);
                }
                res.render("campgrounds/edit", {campground: campground, currentUser: req.user});
            
            });
    
});

router.put("/campgrounds/:id", checkCampgroundOwnership,function(req,res){
    
    var updatedCampground = {
        
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price
    };
   Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, campground){
       if(err){
           req.flash("error",err.message);
           console.log(err);
           res.redirect("/campgrounds/" + req.params.id+"/edit");
       }
       else{
           req.flash("success","Campground updated successfully!");
           res.redirect("/campgrounds/" + req.params.id);
       }
       
   });
    
});


router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req,res){
   
   Campground.findByIdAndRemove(req.params.id, function(err){
       
      if(err){
          req.flash("error","Campground could not be deleted!");
          res.redirect("/campgrounds");
      } 
      else{
          req.flash("success","Campground deleted successfully!");
          res.redirect("/campgrounds");
      }
   }); 
});




function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
    
}

function checkCampgroundOwnership(req, res, next){
     if(req.isAuthenticated())
     {
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err)
           {
               req.flash("error","Campground not found!");
               res.redirect("back");
           } 
           else 
           {
               // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) 
                {
                    next();
                } 
                else 
                {
                    req.flash("error","You do not have the permission to do that!");
                    res.redirect("back");
                }
           }
        });
    }
    else 
    {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}
module.exports = router;