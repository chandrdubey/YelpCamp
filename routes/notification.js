var express= require("express");
var router=express.Router();
var User=require("../models/user");
var Notification =require("../models/notification");
const { findById } = require("../models/comment");

//Handle Notification
router.get('/notifications/:id', async function(req,res){
    try{
        var notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        console.log(notification.campgroundId);
        if(notification.campgroundId){
            res.redirect('/campgrounds/'+ notification.campgroundId);
        }else{
            res.redirect('/users/'+ notification.userId);
        }
    }
    catch(err) {
        req.flash('error', err.message);
        res.redirect('back');
      }
});
//View all the notifications
router.get('/notifications', async function(req,res){
    try{
        //populate notification in decendiding order
        var user =await User.findById(req.user._id).populate({path : 'notifications', options:{sort : {'_id' : -1}} }).exec();
        var allnotifcations = user.notifications;
        res.render('notifications/index', {allnotifications : allnotifcations});
    }
    catch(err) {
        req.flash('error', err.message);
        res.redirect('back');
      }
});



module.exports=router;