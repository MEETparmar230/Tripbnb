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
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8080;

app.use(cors({
  origin:'https://tripbnb-sand.vercel.app',
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
  secret: "yourSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}
app.use(session(sessionOptions));


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




// Use routers
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews',reviewRouter)
app.use('/', userRouter);  

app.get('/check-auth', (req, res) => {
  console.log("Auth check:", req.isAuthenticated?.(), req.user);
  res.json({ isAuthenticated: req.isAuthenticated?.() ?? false });
});
app.get("/whoami", (req, res) => {
  res.json({ user: req.user || null });
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
