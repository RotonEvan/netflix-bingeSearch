var client = require('./connection.js');
var inputfile = require("./netflix.json");
var bulk = [];

var makebulk = function(showlist,callback){
    for (const key in showlist) {
        if (Object.hasOwnProperty.call(showlist, key)) {
            const elm = showlist[key];
            bulk.push(
                { index: {_index: 'netflix', _type: 'shows', _id: key } },
                {
                    "type": elm.type,
                    "title": elm.title,
                    "director": elm.director,
                    "cast": elm.cast,
                    "country": elm.country,
                    "date_added": elm.date_added,
                    "release_year": elm.release_year,
                    "rating": elm.rating,
                    "duration": elm.duration,
                    "listed_in": elm.listed_in,
                    "description": elm.description
                }
            );
        }
    }
    callback(bulk);
}

var indexall = function(madebulk,callback) {
    client.bulk({
        maxRetries: 5,
        index: 'netflix',
        type: 'shows',
        body: madebulk
    },function(err,resp,status) {
        if (err) {
            console.log(err);
        }
        else {
            callback(resp.items);
        }
    })
}

makebulk(inputfile,function(response){
    console.log("Bulk content prepared");
    indexall(response,function(response){
        console.log(response);
    })
});