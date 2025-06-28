import express from 'express'
import Listing from '../models/listing.js'
import {isOwner,validate,isLoggedIn,asyncWrap} from '../utils/middleware.js'
import {index,singleIndex,newForm,updateForm,deleteOne} from '../controllers/listings.js'
import multer from 'multer'
import {storage} from '../cloudConfig.js'

const upload = multer({storage})

const router = express.Router()
 

router
.route("/")
.get(asyncWrap(index))
.post(isLoggedIn,upload.single("image"),validate, asyncWrap(newForm));



router.route("/:id")
.get(asyncWrap(singleIndex))
.put( isLoggedIn, isOwner,upload.single("image"), validate, asyncWrap(updateForm))
.delete(isLoggedIn, isOwner, asyncWrap(deleteOne));

export default router