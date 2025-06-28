import mongoose from "mongoose"
import sampleListings from './data.js'
import Listing from '../models/listing.js'

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
let data = sampleListings;

async function main() {
  try{
    await mongoose.connect(MONGO_URL)
    console.log("database connected")


 await Listing.deleteMany({})
 data = data.map((obj)=>({
  ...obj, owner:"6854ef3f3f133e8ec2543776"
 }))
 await Listing.insertMany(data)
  console.log(data)
}
  catch(err){
    console.log(err)
  }
  finally{mongoose.connection.close()}
}

main()