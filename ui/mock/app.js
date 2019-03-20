const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');

const port = 8080;

let documentsByQuery;
let snippetsByDocument;
let snippetsBySnippet;

fs.readFile('./resources/documents-by-query.json', 'utf8', function(err, contents) {
    documentsByQuery = contents;
});

fs.readFile('./resources/snippets-by-document.json', 'utf8', function(err, contents) {
    snippetsByDocument = contents;
});

fs.readFile('./resources/snippets-by-snippet.json', 'utf8', function(err, contents) {
    snippetsBySnippet = contents;
});

console.log('after calling readFile');
app.use(morgan('dev'));

// get document:
app.get('/es/documents/document/_search', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(documentsByQuery);
});

// get snippets by document
app.get('/es/snippets/snippet/_mget', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(snippetsByDocument);
});

// get 'more like this' snippets:
app.get(' /es/snippets/_search', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(documentsByQuery);
});

app.listen(port, function () {
    console.log('listening on port ' + port + '...');
});