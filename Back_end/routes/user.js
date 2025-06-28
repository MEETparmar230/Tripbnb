import express from 'express'
import {asyncWrap} from '../utils/middleware.js'
import {signUp,login,logOut} from '../controllers/users.js'

const router = express.Router()

router.post("/signup",asyncWrap(signUp))

router.post('/login',login);

router.get("/logout",logOut)



export default router;
