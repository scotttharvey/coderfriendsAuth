const
    express = require('express')
  , session = require('express-session')
  , passport = require('passport')
  , GithubStrategy = require('passport-github').Strategy
  , config = require('./config')

const app = express();

app.use(passport.initialize())
app.use(passport.session());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: config.secret
}))


passport.use(new GithubStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:9000/auth/github/callback'
}, (token, tokenSecret, profile, done) => {
  done(null, profile)
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
  failureRedirect: '/auth/github'
}), (req, res) => {
  req.session.user = loggedInUser;
  res.send(req.session)
}, (err) => {
  if (err) {
    res.redirect('/auth/github')
  } else {
    res.send(req.session)
  }
})


app.listen(9000, () => {
  console.log("Listening on 9000!")
})
