var client = require('./connection');

client.ping({
    // ping usually has a 3000ms timeout
    pingTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

client.cluster.health({},function(err,resp,status) {  
    console.log("-- Client Health --",resp);
});