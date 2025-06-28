import mongoose from 'mongoose'
import {Schema} from 'mongoose'
import Review from './review.js'


const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:false
    },
    coordinates:{
      type:[Number],
      required:false
    }
  },
  reviews:[{
    type: Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
  }
} )

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;

