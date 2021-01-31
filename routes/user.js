var express= require("express");
var router=express.Router();
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


//Show User Profile
router.get("/:id",async function(req, res){
   try{
      var foundUser = await User.findById(req.params.id).populate('followers').exec();       
      var campgrounds = Campground.find().where('author.id').equals(foundUser._id).exec();       
      res.render("users/show", {user : foundUser,campgrounds : campgrounds});
   }
   catch(err){
       req.flash("error", err.message);
       res.redirect("back");
   }
 });

//Edit User Profile
router.get("/:id/edit",async function(req, res){
   var foundUser = await User.findById(req.params.id);
   res.render("users/edit", {user : foundUser});
}); 

router.put("/:id", upload.single('avatar'), function(req, res){
   User.findById(req.params.id, async function(err, user){
     try{
         if(req.file)
        {
         await cloudinary.v2.uploader.destroy(user.avatarId);
         var result = await cloudinary.v2.uploader.upload(req.file.path);
         user.avatar = result.secure_url;
         user.avatarId = result.public_id;
        }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.description = req.body.description;
        user.save();
        req.flash("success", "Successfully Updated!!")
        res.redirect('/users/' + user.id);
     }
     catch(err){
       req.flash("error", err.message);
       res.redirect("back");
     }
   });
});
 module.exports=router;