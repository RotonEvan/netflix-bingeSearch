const express = require('express');
const app = express();

const routes = require('./routes');

const indexer = require('./indexer');

let port = process.env.PORT || 3000;

app.use('', routes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    // importJsonData();
});