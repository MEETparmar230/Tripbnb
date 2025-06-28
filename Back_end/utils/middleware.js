import Listing from '../models/listing.js';
import Review from '../models/review.js'
import joi from 'joi';

//joi Schema
const joiSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().min(0).required(),
  location: joi.string().required(),
  country: joi.string().required(),
  geometry: joi.object({
    type: joi.string().valid('Point'),
    coordinates: joi.array().length(2).items(joi.number())
  }).optional()
}).required();

//review Schema
const ReviewJoiSchema = joi.object({
  review:joi.object({
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required()
  }).required()
})

export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in' });
}

export async function  isOwner(req,res,next){
  let listing = await Listing.findById(req.params.id)
  if(!listing){
    return res.status(404).json({message:"not found"})
  }
  if(!listing.owner.equals(req.user._id)){
    return res.status(403).json({message:"You are not authorized"})
  }
  next()
}

export function validate(req,res,next){
  const {error} = joiSchema.validate(req.body)
  if(error){
    const errmsg = error.details.map((el)=>el.message).join(",")
    return res.status(400).json({status:"error",message:"validation failed" ,error: errmsg})
  }
  else{
  next()
  }
}

export async function isAuthor(req,res,next){
 const review = await Review.findById(req.params.reviewId)
  if(!review){
    return res.status(404).json({message:"Review not Found"})
  }
  if(!review.author.equals(req.user._id)){
   return res.status(403).json({message:"You are not authorized"})
  }
  next()
}

export const validateReview =(req,res,next)=>{
  const {error} = ReviewJoiSchema.validate(req.body)
  if(error){
    const errmsg = error.details.map((el)=>el.message).join(",")
    return res.status(400).json({status:"error",message:"validation failed" ,error: errmsg})
  }
  else{
  next()
  }
}

//asyncWrap
export function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}