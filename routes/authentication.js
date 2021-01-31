 var express= require("express");
 var router=express.Router();
 var passport=require("passport");
 var User=require("../models/user");
 var Campground=require("../models/campgrounds");
 var multer = require('multer');

 var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
 });
 var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
 };
 var upload = multer({ storage: storage, fileFilter: imageFilter})

 var cloudinary = require('cloudinary');
 cloudinary.config({ 
  cloud_name: 'imagehigh', 
  api_key: '889884917544354', 
  api_secret: 'MCmMuczRywCm5iKz5AX11lbPpDs'
 });

//LANDING- landing page campgrounds

 router.get("/",function(req,res){
    res.render("landing");
  });
//==============
//Auth routes
//==============

//Show register form
 router.get("/register",function(req,res){
    res.render("register");
 });
 router.post("/register",  upload.single('avatar'), function(req, res){

      console.log(req.path);
      cloudinary.v2.uploader.upload(req.file.path, function(err, result){
         if(err){
            req.flash("error", err.message);
            res.redirect("back");
         }
         var newUser = new User(
            {
               username  : req.body.username,
               firstName : req.body.firstName,
               lastName  : req.body.lastName,
               avatar    : result.secure_url,
               email     : req.body.email,
               avatarId  : result.public_id
            }
         );
         User.register(newUser, req.body.password,function(err,user){
            if(err){
               console.log(err);
               req.flash("error", err.message);
               return res.redirect("/register");
            }
               passport.authenticate("local")(req,res,function(){
               req.flash("success", "Welcome to YelpCamp "+ user.username);
               res.redirect("/campgrounds");
               });
         });
      });
     
 });
 //Show- Login Page
 router.get("/login",function(req,res){
    res.render("login");
 });
 
 router.post("/login", passport.authenticate("local",
     {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
     }),function(req,res){
     }); 
 //Logout route
 router.get("/logout", function(req,res){
    req.logOut();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
 });
 
 //User Profile
 router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       if(err){
          req.flash("error", err.message);
          res.redirect("back");
       }
       else{
          Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
               req.flash("error", err.message);
               res.redirect("back");
            }else{
               res.render("users/show", {user : foundUser,campgrounds : campgrounds});
            }
          })
        
       }
    })
 });

 module.exports=router;