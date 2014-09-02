var express = require('express');

var apiFiles = './backend';
var wwwFiles = './frontend';

require(apiFiles + '/app')(function(backend) {
  var www = express.static(wwwFiles);
  express()
    .use('/api', backend)
    .use('/', www)
    .listen(process.env.PORT || 8888);
});
