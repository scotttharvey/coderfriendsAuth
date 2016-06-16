const
    express = require('express')
  , session = require('express-session')
  , passport = require('passport')
  , GithubStrategy = require('passport-github2').Strategy
  , config = require('./config')

const app = express();
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.secret
}))
app.use(express.static(__dirname + "/public"))
app.use(passport.initialize())
app.use(passport.session());


passport.use(new GithubStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (token, tokenSecret, profile, done) => {
  return done(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})

const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(403).send();
  }
  return next();
}


app.get('/auth/github', passport.authenticate('github'))

app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/#/home',
  failureRedirect: '/'
}), (req, res) => {
  req.session.user = loggedInUser;
  res.send(req.session)
}, (err) => {
  if (err) {
    res.redirect('/')
  } else {
    res.send(req.session)
  }
})

app.listen(3000, () => {
  console.log("Listening on 3000!")
})
