const express = require('express');

const router = express.Router();

const elastic = require('elasticsearch');

const bodyParser = require('body-parser').json();

const cors = require('cors');

const elasticClient = elastic.Client({
    host: 'localhost:9200',
    apiVersion: '7.2'
});

router.use(cors());

// router.use((req, res, next) => {
//     elasticClient.index({
//         index: 'logs',
//         body: {
//             url: req.url,
//             method: req.method
//         }
//     })
//     .then(res => {
//         console.log('Logs indexed');
//     })
//     .catch(err => {
//         console.log(err+" err");
//     })
//     next();
// });

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

// http://localhost:3000/exact?field=director&value=David

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

// router.post('/shows', bodyParser, (req, res) => {
//     elasticClient.index({
//         index: 'shows',
//         body: req.body
//     })
//     .then(resp => {
//         return res.status(200).json({
//             msg: 'show indexed'
//         });
//     })
//     .catch(err => {
//         return res.status(500).json({
//             msg: 'Error',
//             err
//         });
//     });
// });



router.get('/shows', (req, res)=>{
    let query = {}
    if (req.query.type) query.q =  `*${req.query.type}*`;
    elasticClient.search(query)
    .then(resp=>{
        return res.status(200).json({
            products: resp.hits.hits
        });
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            msg: 'Error',
            err
        });
    });
});
  
module.exports = router;