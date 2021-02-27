var mongoose            = require('mongoose');
require('dotenv').config();
let mongoDB = process.env.MONGODB_URL;

//let mongoDB =  'mongodb://localhost:27017/yelp_camp_v13';
//console.log(process.env.MONGODB_URL);
//var mongoDB = 'mongodb+srv://highly:dbyelpcamp@yelpcamp-mzmvq.mongodb.net/test?retryWrites=true&w=majorit';
mongoose.connect(mongoDB,{ useNewUrlParser: true,useUnifiedTopology: true  });
const db=mongoose.connection;
db.on('error', console.log.bind('Error in connecting to the Database'));

db.once('open', function()
{
    console.log('Connected to the Database!');
});

module.exports = db;