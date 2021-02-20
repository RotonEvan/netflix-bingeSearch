const express = require('express');

const router = express.Router();

const elastic = require('elasticsearch');

const bodyParser = require('body-parser').json();

const elasticClient = elastic.Client({
    host: 'localhost:9200'
});

router.use((req, res, next) => {
    elasticClient.index({
        index: 'logs',
        body: {
            url: req.url,
            method: req.method
        }
    })
    .then(res => {
        console.log('Logs indexed');
    })
    .catch(err => {
        console.log(err+" err");
    })
    next();
});

router.post('/shows', bodyParser, (req, res) => {
    elasticClient.index({
        index: 'shows',
        body: req.body
    })
    .then(resp => {
        return res.status(200).json({
            msg: 'show indexed'
        });
    })
    .catch(err => {
        return res.status(500).json({
            msg: 'Error',
            err
        });
    });
});

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