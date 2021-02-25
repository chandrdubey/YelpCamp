var express= require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");
var Review = require("../models/review");
//  middleware.isLoggedIn
// Campground rating 
router.post("/:id/reviews",async(req, res)=>{
    try{
        // console.log(req.params);
        let campground = await Campground.findById(req.params.id).populate("reviews").exec();
        console.log(campground);
        try {
            let data = {rating : req.body.rating , review: req.body.review}; 
            console.log(data);
            let review = await Review.create(data);
            console.log(campground);
            //add author username/id and associated spot to the review
            console.log(campground._id);
            console.log(req.user);
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.campGround = campground._id;
            //save review
            review.save();
            campground.reviews.push(review);
            // calculate the new average review for the campground
            campground.rating = calculateAverage(campground.reviews);
            //save spot
            campground.save();
            console.log(review)

            req.flash("success", "Your review has been successfully added.");
            res.redirect('/campgrounds/' + campground._id);
        } 
        catch (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            return res.redirect("back");
        }
    }catch (err) {
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

module.exports=router;