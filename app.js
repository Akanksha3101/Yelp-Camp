var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comments");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");


//===============================
// FOR ROUTES
//===============================

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");




mongoose.connect("mongodb+srv://Akanksha:LDSM2jn5neR42EJ@cluster0-ht61o.mongodb.net/yelp-camp?retryWrites=true&w=majority", 
{useNewUrlParser :true, useCreateIndex: true}).then(() =>{
   
 console.log("CONNECTED TO DB!")  
}).catch(err => {
   console.log('ERROR:',err.message);
})

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());


//seedDB();


//=============================
//  PASSPORT CONFIG
//=============================


app.use(require("express-session")({
    
   secret: "passwords are so overrated this is blah blha buehhh",
   resave: false,
   saveUninitialized: false
    
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
    
   res.locals.error = req.flash("error"); 
   res.locals.success = req.flash("success");
   next();
});


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(req,res){
    
   console.log("Server started on port "+process.env.PORT); 
});