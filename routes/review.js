var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var User=require("../models/user");
var Review = require("../models/review");
var Notification = require("../models/notification");
//  middleware.isLoggedIn
// Campground rating
router.post("/:id/reviews", async (req, res) => {
  try {
    // console.log(req.params);
    let campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .exec();
    console.log(campground);
    try {
      let data = { rating: req.body.rating, review: req.body.review };
      console.log(data);
      let review = await Review.create(data);
    //   console.log(campground);
    //   //add author username/id and associated spot to the review
    //   console.log(campground._id);
    //   console.log(req.user);
      review.author.id = req.user._id;
      review.author.username = req.user.username;
      review.campGround = campground._id;
      //save review
      review.save();
      campground.reviews.push(review);
      let user  = await User.findById(req.user._id).populate('followers').exec();
       console.log(user);
      var newReviewNotification = {
        campgroundId: campground.id,
        username: user.username,
        avatar: user.avatar,
        userId: req.user._id,
        typeOfN: "new review campground",
      };
       console.log(campground.author.id + "hell");
      var campgroundAuthor = await User.findById(campground.author.id)
        .populate("followers")
        .exec();
        console.log(campgroundAuthor);
        var newReviewN = await Notification.create(newReviewNotification);
        campgroundAuthor.notifications.push(newReviewN);
          campgroundAuthor.save();
    
      var newReviewByUserNotification = {
        campgroundId: campground.id,
        username: user.username,
        avatar: user.avatar,
        userId: req.user._id,
        typeOfN: "new review by user",
      };
      var newReviewUserN = await Notification.create(newReviewByUserNotification);
      // calculate the new average review for the campground
      campground.rating = calculateAverage(campground.reviews);
      for (var follower of user.followers) {
         if(!follower._id.equals(campgroundAuthor._id)){
            follower.notifications.push(newReviewUserN);
            await follower.save();
         }  
       
      }
      campground.save();
      console.log(review);

      req.flash("success", "Your review has been successfully added.");
      res.redirect("/campgrounds/" + campground._id);
    } catch (err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Something went wrong");
    console.log(err);
    return res.redirect("back");
  }
});

function calculateAverage(reviews) {
  //calculate average rating
  if (reviews.length === 0) {
    return 0;
  }
  let sum = 0;
  reviews.forEach((element) => {
    sum += element.rating;
  });
  let res = sum / reviews.length;
  res = res.toPrecision(2); //for upto 2 decimal
  return res;
}

module.exports = router;
