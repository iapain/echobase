module.exports = function(app) {
  require('./auth.coffee')(app);
  require('./call.coffee')(app);
}
