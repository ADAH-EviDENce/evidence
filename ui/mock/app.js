const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');

let documents;

fs.readFile('./resources/documents.json', 'utf8', function(err, contents) {
    documents = contents;
    console.log("documents:", contents);
});

console.log('after calling readFile');
app.use(morgan('dev'));

app.get('/es/documents/document/_search', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(documents);
});

app.listen(8080, function () {
    console.log('listening on port 8080...');
});