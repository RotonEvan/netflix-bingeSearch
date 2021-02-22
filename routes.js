const express = require('express');

const router = express.Router();

const elastic = require('elasticsearch');

const bodyParser = require('body-parser').json();

const cors = require('cors');

const elasticClient = elastic.Client({
    host: '52.66.252.139:9200',
    apiVersion: '7.2'
});

router.use(cors());

router.get('/data', (req, res) => {
    const data = req.query.q;
    res.send(`Received ${data}`);
})

// http://localhost:3000/top?q=to

router.get('/top', (req, res) => {
    let q = req.query.q;
    elasticClient.search({
        index: 'netflix',
        body: {
            "size": 5,
            "query": {
                "multi_match": {
                    "query": q
                }
            }
        }
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// http://localhost:3000/toprated?q=to

router.get('/toprated', (req, res) => {
    elasticClient.search({
        index: 'netflix',
        body: {
            "size": 5,
            "query": {  
                "bool" : {
                    "must" : {
                        "match_phrase" : { "title" : { query: req.query.q} }
                    },
                    "must_not" : {
                        "match_phrase" : { "rating" : "R" },
                        "match_phrase" : { "rating" : "NC" },
                        "match_phrase" : { "rating" : "PG" }
                    },
                    
                  }
            }
        }
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// http://localhost:3000/paginate?pageno=3&pagesize=10&type=Movie

router.get('/paginate', function (req, res) {
    let offset=(req.query.pageno-1) * req.query.pagesize;
    elasticClient.search({
    index: 'netflix',
    body: { 
        "from" : offset,
        "size" : req.query.pagesize,
        "query": {
              "bool": { 
                  "must": [{ "match":{ "type": req.query.type } }]
              }
          },
        "sort": [{ "release_year" : { "order": "desc" } } ]
    }
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// http://localhost:3000/exact?field=director&q=David

router.get('/exact', function (req, res) {
    var key={}
    key[req.query.field]={query : req.query.q}
    elasticClient.search({
    index: 'netflix',
    body: {
        "query": {
            "bool": { 
                "must": [{ "match": key}]
            }
        },
    }
   
    }).then(function(resp) {
        console.log("Response:", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// http://localhost:3000/prefix?value=After

router.get('/prefix', function (req, res) {
    elasticClient.search({
        index: 'netflix',
        body: {
            "query": {
                "match_phrase_prefix": {
                    "description": {
                        "query": req.query.value
                    }
                }
            }
        }    
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// http://localhost:3000/genre?q=Drama%20and%20Horror

router.get('/genre', function (req, res) {
    elasticClient.search({
        index: 'netflix',
        body: {
            "query": {
                    "query_string" : {
                        "default_field" : "listed_in",
                        "query" : req.query.q
                    }
            }
        }
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

router.get('/exact2', function (req, res) {
    elasticClient.search({
        index: 'netflix',
        body: {
            "query": {
                    "query_string" : {
                        "default_field" : "listed_in",
                        "query" : req.query.q,
                        "analyzer": {
                            "my_analyzer": {
                                "tokenizer": "my_tokenizer"
                            }
                        },
                        "tokenizer": {
                            "my_tokenizer": {
                                "type": "ngram",
                                "min_gram": 3,
                                "max_gram": 4,
                                "token_chars": [
                                    "letter",
                                    "digit"
                                ]
                            }
                        }
                    }
            }
        }
    }).then(function(resp) {
        console.log("Response: ", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

module.exports = router;