const express = require('express');
const server = express();
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

server.use(morgan('dev'));

// get document:
server.get('/es/documents/document/_search', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(documentsByQuery);
});

// get snippets by document
server.post('/es/snippets/snippet/_mget', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(snippetsByDocument);
});

// get 'more like this' snippets:
server.get(' /es/snippets/_search', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(documentsByQuery);
});

server.listen(port, function () {
    console.info('listening on port ' + port + '...');
});