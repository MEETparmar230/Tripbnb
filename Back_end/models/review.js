import mongoose from "mongoose"

const Schema = mongoose.Schema

const reviewSchema = Schema({
    
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true},

    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

export default mongoose.model("Review",reviewSchema)