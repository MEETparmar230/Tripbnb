import express from 'express'

import {isLoggedIn,isAuthor,validateReview,asyncWrap} from '../utils/middleware.js'
import {createReview,deleteReview} from '../controllers/reviews.js'
const router = express.Router({ mergeParams: true });


//review Post route
router.post("/",isLoggedIn, validateReview, asyncWrap(createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor, asyncWrap(deleteReview));

export default router