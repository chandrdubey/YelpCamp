var express= require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var User=require("../models/user");
var Notification=require("../models/notification");
var middleware=require("../middleware");
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
  //CAMPGROUNDS- show all campgrounds
router.get("/",function(req,res)
{
   if (req.query.search) {
     //Campground find on the basis of search
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Campground.find({name: regex},function(err,campgrounds){
         if(err){
            console.log(err);
         } else{  
           if(campgrounds.length==0){
            req.flash("error","No result found");
            res.redirect("/campgrounds");
           }
           else{
            res.render("campground/index",{campgnd:campgrounds, currentUser :req.user});
           }  
         }
      });
   }
   else{
      Campground.find({},function(err,campgrounds){
         if(err){
            console.log(err);
         } else{  
           
           res.render("campground/index",{campgnd:campgrounds, currentUser :req.user});
         }
      });
   }
     
});
//POST- Campground
router.post("/", middleware.isLoggedIn, upload.single('image'),async function(req, res) {
     try{
      var result = await cloudinary.v2.uploader.upload(req.file.path);
      console.log(result); 
      //Add cloudinary url for image to the campground object
       req.body.campground.image = result.secure_url;
      //Add image public_id to campground object
       req.body.campground.imageId = result.public_id;
       //Add author to campground
       req.body.campground.author={
       id: req.user._id,
       username: req.user.username
       } 
       var campground = await Campground.create(req.body.campground);
       var user = await User.findById(req.user._id).populate('followers').exec();
       console.log(req.user);
      
       var newNotification = {
          campgroundId : campground.id,
          username     : user.username,
          avatar       : user.avatar,
          userId       : req.user._id
       }
       var notification = await Notification.create(newNotification);
       for(var follower of user.followers){
          follower.notifications.push(notification);
          await follower.save();
       }
       res.redirect('/campgrounds/' + campground.id);    
     }
   catch(err){
      req.flash("error", err.message);
      res.redirect("back");
   }
});
//NEW- crearte new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
  
     res.render("campground/new");
});
//show-more info about the campgrounds
  
router.get("/:id",async (req,res)=>{
     let found = await Campground.findById(req.params.id).populate("comments").exec();
   
     if(found){
         console.log(found);
         let allCampgrounds =await Campground.find();
         res.render("campground/show",{campground:found, allCampgrounds});
      }
});
//EDIT->Campground routes
router.get("/:id/edit",middleware.CampgroundOwnerShip,function(req,res){
   Campground.findById(req.params.id,function(err, found){
      res.render("campground/edit",{campground:found});
   });    
});
//UPDATE->Campground routes
router.put("/:id", middleware.CampgroundOwnerShip, upload.single('image'), function(req,res){
   Campground.findById(req.params.id, async function(err,campground){
         if(err){
            req.flash("error", err.message);
            res.redirect("back");
         }else{
            if(req.file)
            {
               try{
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image  = result.secure_url;
               }
               catch(err){
                  req.flash("error", err.message);
                  return res.redirect("back");
               }
            }
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.price =  req.body.campground.price;
            campground.save();
            req.flash("success", "Successfully Updated!!")
            res.redirect('/campgrounds/' + campground.id);
        }
     });
});
//DESTROY->Campground routes
router.delete("/:id",middleware.CampgroundOwnerShip,  function(req,res){
     Campground.findById(req.params.id, async function(err, campground){
        if(err){
           req.flash("error", err.message);
           res.redirect("back");
        }
        else{
           try{
              await cloudinary.v2.uploader.destroy(campground.imageId);
              campground.remove();
              req.flash("Success", "Successfully Removed!");
              res.redirect("/campgrounds");
          }
           catch(err){
              req.flash("error", err.message);
              res.redirect("back");
           }
        }
     });
});

// Campground rating 
router.post("/:id/rating", async(req, res)=>{
     console.log("hello");
     console.log(req.body);
})
//Fuzzy Search
function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
 };
  module.exports=router;