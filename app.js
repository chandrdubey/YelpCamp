var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var methodOverride      = require("method-override"); 
var Campground          = require("./models/campgrounds");
var Comment             = require("./models/comment");
var flash               = require("connect-flash");
var User                = require("./models/user");
var moment              = require('moment');  //display dates and times in diffrent formats
var db                  = require("./config/mongoose");
//var seedDB              = require("./seed");
require('dotenv').config();
var PORT   =  process.env.PORT || 3000;

var commentRoutes = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes = require("./routes/authentication"),
    userRoutes = require("./routes/user"),
    followSystemRoutes = require("./routes/followSystem"),
    notificationRoutes = require("./routes/notification"),
    reviewRoutes = require("./routes/review");


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret:process.env.secret,
   resave: false,
   saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.locals.moment = moment;


app.use(async function(req,res,next){
      try{
         res.locals.currentUser=req.user;
         if(req.user){
         var user = await  User.findById(req.user._id).populate('notifications', null, {isRead : false}).exec();
         res.locals.notifications = await user.notifications.reverse();
         }
         res.locals.error=req.flash("error");
         res.locals.success=req.flash("success");
         next();
      }
      catch(err){
         console.log(err);
      }
});  
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/users",userRoutes);
app.use("/",followSystemRoutes);
app.use("/",notificationRoutes);
app.use("/campgrounds",reviewRoutes);
app.get('*', (req,res)=>{
   res.send("hello");
});

app.listen(PORT,function(){
console.log("running");
});