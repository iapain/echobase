module.exports = (app) ->
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  app.get "/", (req, res) ->
    if req.user?
      res.redirect "/dashboard"
    else
      res.render "index", user:req.user

  app.get "/dashboard", ensureLoggedIn('/login'), (req, res) ->
    res.render "dashboard", user:req.user
