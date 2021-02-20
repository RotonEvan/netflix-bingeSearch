const elastic = require('elasticsearch');

const elasticClient = elastic.Client({
    host: 'localhost:9200',
    // log: 'trace',
    sniffOnStart: true

});

module.exports = elasticClient;