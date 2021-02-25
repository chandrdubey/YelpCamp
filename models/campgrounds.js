var mongoose = require('mongoose');

//Schema
var campgroundSchema= new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    imageId: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author:{
      id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      username: String
    },
    comments:[
      {
       type:mongoose.Schema.Types.ObjectId,
       ref :"Comment"
      }
    ]
 });
module.exports= mongoose.model("Campground", campgroundSchema);