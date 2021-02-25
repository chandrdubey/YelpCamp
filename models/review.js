const mongoose   = require("mongoose");

//Reviw Schema
let reviewSchema = new mongoose.Schema({
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        default:0
    },
    review: String,
    // author id and username fields
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // Tourist Spot associated with the review
    campGround: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }
});

module.exports = mongoose.model("Review", reviewSchema);