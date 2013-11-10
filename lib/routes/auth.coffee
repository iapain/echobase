module.exports = (app) ->
  passport = require('passport')
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  app.get "/", (req, res) ->
    if req.user?
      res.redirect "/dashboard"
    else
      res.render "index", user:req.user

  app.get "/dashboard", ensureLoggedIn('/login'), (req, res) ->
    res.render "dashboard", user:req.user

  # Login logout methods
  app.get "/login", (req, res) ->
    res.redirect "/auth/twitter"

  app.get "/logout", (req, res) ->
    req.logout()
    res.redirect "/"

  # Twitter auth related stuff
  app.get "/auth/twitter", passport.authenticate "twitter"
  app.get "/auth/twitter/callback", passport.authenticate 'twitter',
    { successReturnToOrRedirect: '/', failureRedirect: '/login' }

