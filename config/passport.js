const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

//有疑問!? 參考教案與同學的作業都加入於app.js，但實際操作放在passport.js才能順利啟動，放在app.js無法讀到env檔案內容
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())



  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json
  User.findOne({ email })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(user => done(null, user))
        .catch(err => done(err, false))

    })
}))