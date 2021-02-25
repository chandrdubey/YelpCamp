var mongoose = require('mongoose');

//Schema
var campgroundSchema= new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    imageId: String,
    description: String,
    city:String,
    createdAt: { type: Date, default: Date.now },
    rating :{type: Number, default:0},
    totalRating:{type: Number, default:0},
    author:{
      id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      username: String
    },
    reviews: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review"
      }
  ],
    comments:[
      {
       type:mongoose.Schema.Types.ObjectId,
       ref :"Comment"
      }
    ]
 });
module.exports= mongoose.model("Campground", campgroundSchema);