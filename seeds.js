var mongoose = require("mongoose");
var Comment = require("./models/comments")
var Campground = require("./models/campground");


var data = [
        {
            name: "Campground Tofino",
            image: "http://www.loneconetrail.ca/sites/default/files/styles/header/public/header_images/campground-v2.jpg?itok=fqhTCtod",
            description: "25 campsites are thoughtfully positioned to maximize privacy and take advantage of a breathtaking white sand beach. We have implemented the kitchen with all campsite fees, the kitchen is a communal kitchen including BBQs. There are also, two stone fire pits located at the campsiteand one communal gazebo for guests to sit around and swap tales and sing songs."
        },
        {
            name: "Cloud's Rest",
            image: "https://images.unsplash.com/photo-1533632359083-0185df1be85d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Picture from unsplash"
        },
        {
            name: "The Skyglow",
            image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            description: "Come here for a beautiful night with the fireflies. Watch them as they light up the whole sky and the world!"
        },
    ]
function seedDB()
{
    
    Campground.remove({},function(err){
        
        if(err)
        {
            console.log("Error in removing campground!");
        }
        else{
            console.log("Campgrounds removed!");
            Comment.remove({},function(err){
                
                if(err){
                    console.log("Error in removing comments");
                }
                else{
                    console.log("Comments removed");
                    data.forEach(function(camp){
                        
                        Campground.create(camp,function(err,campground){
                            
                            if(err){
                                console.log("Error in creating campgrounds");
                            }
                            else{
                                
                                console.log("Campgrounds created");
                                Comment.create({
                                    
                                    text: "The place is so great!",
                                    author: "Homer"
                                },function(err, comment){
                                    
                                    if(err){
                                        
                                        console.log("Error in creating comment");
                                    }
                                    else{
                                        
                                        
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Comment successfully created");
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });   
}

module.exports = seedDB;