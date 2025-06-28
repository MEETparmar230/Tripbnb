import Passport from 'passport';
import User from '../models/user.js'

export const signUp =async (req, res) => {
  const { username, email, password } = req.body

  try {
    const newUser = new User({ username, email })
    const registeredUser = await User.register(newUser, password)
    
    
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err)
      }
      res.status(200).json({ status: 'success', message: "User was registered" })
    })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}

export const login =  async (req, res, next) => {
  Passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
  message: 'Welcome! You are logged in!',
  user: {
    _id: user._id,
    username: user.username
  },
  isAuthenticated: true
});
    });
  })(req, res, next);
}

export const logOut = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err)
    }
     res.json({message:"logout Succesfully"})
  })
}