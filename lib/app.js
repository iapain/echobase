
/**
 * Module dependencies.
 */
require('coffee-script');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , settings = require('./settings')
  , routes = require('./routes')
  , RedisStore = require('connect-redis')(express)
  , redis = require('redis').createClient()
  , mongoose = require('mongoose');

mongoose.connect(settings.app.mongodb);

var app = express();
var isProduction = (process.env.NODE_ENV === 'production');
var port  = process.env.PORT || settings.app.port || 3000;
var host = "http://localhost:" + port;
if(isProduction) { port = 80; host = "http://dopemob.2013.nodeknockout.com"}

var User = require('./resources/user').User;

app.configure(function(){
  app.set('port', port);
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');
  app.set('jsonp callback', "callback");
  app.use(function (req, res, next) {
    res.header("X-powered-by", "EBS");
    next();
  });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use("/static", express.static(path.join(__dirname, '../public')));
  app.use(express.cookieParser());
  app.use(express.session({
      secret: 'keyboad loki',
      store: new RedisStore({
        host: "localhost", port: 6397, client: redis
      }),
      cookie: {maxAge: 14*24*60*60*1000 }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(function(req, res, next) {
    app.locals.user = req.user;
    next();
  });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: settings.app.auth.twitter.consumer_key,
    consumerSecret: settings.app.auth.twitter.consumer_secret,
    callbackURL: host + "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({username: profile.username}, function(err, user) {
      if(user) {
        done(null, user);
      } else {
        var user = new User();
        user.provider = "twitter";
        user.username = profile.username;
        user.name = profile.displayName;
        user.bio = profile._json.description;
        user.image = profile._json.profile_image_url;
        user.save(function(err) {
          if(err) { throw err; }
          done(null, user);
        });
      }
    })
  }
));

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// bind routes to apps
routes(app);

var server = http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

});
