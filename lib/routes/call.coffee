User = require('../resources/user').User
Room = require('../resources/room').Room

module.exports = (app) ->
  passport = require('passport')
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  # TODO
  # this should check if user is not in a call (user.incall should be false)
  app.get "/call/:user", ensureLoggedIn('/login'), (req, res) ->
    username = req.params["user"]
    User.findOne {username: username}, (err, user) ->

      # first check if user.incall is false

      room = new Room()
      room.participants.push user.username
      room.participants.push req.user.username
      room.limit = 2

      room.save ->
        # socket.emit('connect with', {user: "#{req.user.username}", room: "#{room.id}"});
        res.render "call/show", room: room, user: req.user, callee: user

  # TODO
  # this should set user.incall to true
  app.get "/room/:room", ensureLoggedIn('/login'), (req, res) ->
    room = req.params["room"]
    Room.findOne {_id: room}, (err, room) ->
      if err then return res.redirect("/")
      unless room then return res.redirect("/")

      # set user.incall to true to avoid multiple calling to the person which is already calling

      # if room.participants.indexOf(req.user.username) > -1
      #   unless room.answeredBy.indexOf(req.user.username)
      #     room.answeredBy.push(req.user.username)
      #     room.remainingParticipants.push(req.user.username)
      #   room.save ->
      res.render "call/room", user: req.user, room: room
      # else
      #   res.redirect "/"

  # TODO
  # It should set user.incall to false and remove user from room.remainingParticipants

  app.get "/room/:room/end", ensureLoggedIn('/login'), (req, res) ->
    room = req.params["room"]
    Room.findOne {_id: room}, (err, room) ->
      if err then return res.redirect("/")
      unless room then return res.redirect("/")

      # disconnect user from this call
      # set user.incall to false

      participantId = room.remainingParticipants.indexOf(req.user.username)
      if participantId > -1
        room.remainingParticipants[participantId] = null

        if room.remainingParticipants.length < 1 then room.endedAt = Date.now()

        room.save ->
          res.render "call/room", user: req.user, room: room
      else
        res.redirect "/"
