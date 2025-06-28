import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import listingRouter from './routes/listing.js'
import userRouter from './routes/user.js'
import session from 'express-session'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from './models/user.js'
import reviewRouter from './routes/review.js';
import dotenv from "dotenv"
import Listing from './models/listing.js'
import MongoStore from 'connect-mongo';
dotenv.config()

const app = express();



app.use(cors({
  origin: [
    'https://tripbnb-sand.vercel.app',
    'https://tripbnb-git-main-meetparmar2362004-1225s-projects.vercel.app',
    'https://tripbnb-fd307ffgh-meetparmar2362004-1225s-projects.vercel.app'
  ],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(process.env.MONGODB);
}

const sessionOptions = {
  secret: "myNameIsKhan",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
  }
}

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/check-auth', (req, res) => {
  console.log("Auth check:", req.isAuthenticated?.(), req.user);
  res.json({ isAuthenticated: req.isAuthenticated?.() ?? false });
});

app.get("/search", async (req, res) => {
  const { country } = req.query;
  try {
    const listings = await Listing.find({
      country:{$regex:new RegExp(country,'i')} 
    });
    res.json({ listings,country });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


// Use routers
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews',reviewRouter)
app.use('/', userRouter);  
         

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
