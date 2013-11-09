
/**
 * Module dependencies.
 */
require('coffee-script');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , settings = require('./settings')
  , routes = require('./routes')
  , RedisStore = require('connect-redis')(express)
  , redis = require('redis').createClient();

var app = express();
var isProduction = (process.env.NODE_ENV === 'production');
var port  = process.env.PORT || settings.app.port || 3000;
if(isProduction) { port = 80; }

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
  app.use(express.session({ secret: 'keyboad loki', store: new RedisStore({
      host: "localhost", port: 6397, client: redis
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// bind routes to apps
routes(app);

http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

