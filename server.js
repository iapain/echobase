require('nko')('fcPyBqThEKVgM-bA');
module.exports = process.env.ECHOBASE_COV
  ? require('./lib-cov/app')
  : require('./lib/app');
