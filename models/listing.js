const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

   image: {
    filename: {
        type: String,
        default: "default-image"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
    }
},

    price: Number,
    location: String,
    country: String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    },],
       owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
});

listingSchema.post("findOneAndDelete", async  (listing)=>{
 if(listing){
    await Review.deleteMany({
        _id : {
            $in : listing.reviews
        }
    })
 }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;