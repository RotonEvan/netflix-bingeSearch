const elastic = require('elasticsearch');

const elasticClient = elastic.Client({
    host: '52.66.252.139:9200',
    // log: 'trace',
    sniffOnStart: true

});

module.exports = elasticClient;