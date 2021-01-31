var express= require("express");
var router=express.Router();
var User=require("../models/user");
var Notification =require("../models/notification");
const { isLoggedIn } = require("../middleware");

const user = require("../models/user");
//Follow User
router.get("/follow/:id", isLoggedIn, async function(req, res){
   try{  
    var userFollower = await User.findById(req.params.id);
    console.log(userFollower);
    userFollower.followers.push(req.user._id);
    userFollower.save();
    var userFollowing = await User.findById(req.user._id);
    console.log(userFollowing);
    userFollowing.followings.push(req.params.id);
    userFollowing.save();
    var newNotification = {
      username : userFollowing.username,
      avatar   : userFollowing.avatar,
      userId   : req.user._id
    }
    var notification =await Notification.create(newNotification);
    userFollower.notifications.push(notification);
    userFollower.save();
    res.redirect('/users/' + req.params.id);
   }
   catch(err){
    req.flash("error", err.message);
    res.redirect("back");
   }
 });
// Unfollow User
router.get("/unfollow/:id", isLoggedIn, async function(req, res){
   try{
      
      var userFollower = await User.findById(req.params.id);   
      // removing current login user from followers array of user
      userFollower.followers =await  userFollower.followers.filter(item => !item.equals(req.user._id));
      userFollower.save();
      // removiing current login user from followings array of current login user
      var userFollowing = await User.findById(req.user._id);
     userFollowing.followings = await userFollowing.followings.filter(item => !item.equals(req.params.id));
      console.log(userFollowing);
      userFollowing.save();
      res.redirect('/users/' +  req.params.id);
   }
   catch(err){
      req.flash("error", err.message);
      res.redirect("back");
     }
});

  
 
module.exports=router;