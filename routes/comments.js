var express = require("express");
var router = express.Router();



var Campground = require("../models/campground");
var User = require("../models/user");
var Comment = require("../models/comments");

//=======================================
// COMMENTS ROUTE
//=======================================
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        
        if(err || !campground){
            console.log(err);
        }
        else{
            res.render("./comment/new", {campground: campground,  currentUser: req.user});
        }
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn,function(req,res){
    
    Campground.findById(req.params.id, function(err, campground){
        
        if(err || !campground){
            
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("/campgrounds");
        }
        else{
            
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","New comment could not be added!");
                    console.log(err);
                }
                else{
                    
                    //add username and id to comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment added successfully!");
                    res.redirect("/campgrounds/" +campground._id);
                }
                
            })
            
        }
    });
    
});

router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req,res){
   Campground.findById(req.params.id, function(err, campground){
       
      if(err || !campground)
      {
          req.flash("error","Something went wrong!");
          res.redirect("/campgrounds");
      }
      else{
          Comment.findById(req.params.comment_id, function(err, comment){
              
              if(err || !comment)
              {
                  req.flash("error","Something went wrong!");
                  res.redirect("/campgrounds/" +req.params.id);
              }
              else
              {
                  res.render("./comment/edit", {campground: campground, comment: comment, currentUser: req.user}); 
              }
          });
   }});
   
});

router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
    
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
     if(err || !updatedComment){
         req.flash("error","Comment could not be edited!");
         res.redirect("back");
     }
     else{
         req.flash("Comment edited!");
         res.redirect("/campgrounds/" +req.params.id);
     }
       
   })
});


router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
        {
            req.flash("error","Comment could not be deleted!");
            res.redirect("back");
        }
        else
        {
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/" +req.params.id)
        }    
    });
});

function checkCommentOwnership(req, res, next){
    
    
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment)
        {
           if(err || !foundComment)
           {
               req.flash("error","Comment not found!");
               res.redirect("back");
           }
           else
           {
               console.log(foundComment);
               if(req.user._id.equals(foundComment.author.id))
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






function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
    
}

module.exports = router;