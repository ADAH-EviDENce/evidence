#!/usr/bin/env python3

from collections import defaultdict
import json
from io import StringIO
import os
import re
import sys
import time

import elasticsearch


NUM_PARTS = re.compile(r'(\d+)')


def natural_key(s):
    '''Key function for natural sort.'''
    return [int(part) if part.isdigit() else part for part in NUM_PARTS.split(s)]


es = elasticsearch.Elasticsearch(*sys.argv[3:])

es.indices.delete('_all')

# Documents are lists of snippets.
es.indices.create('documents', body={
    "mappings": {
        "document": {
            "properties": {
                "sub": {
                    "type": "keyword",
                },
            },
        },
    },
})

# Snippets contain the actual text, in fields text and lemmata.
# The analyzer is "simple" because the texts are pre-tokenized.
es.indices.create('snippets', body={
    "mappings": {
        "snippet": {
            "properties": {
                "text": {
                    "type": "text",
                    "analyzer": "simple",
                },
                "lemma": {
                    "type": "text",
                    "analyzer": "simple",
                },
                "document": {
                    "type": "keyword",
                },
            },
        },
    },
})


snippets = defaultdict(set)

print('Indexing...')
with open(sys.argv[1]) as idfile, open(sys.argv[2]) as textfile:
    for ident, text in zip(idfile, textfile):
        ident = ident.strip()

        doc, _ = ident.split('_paragraph', 1)
        snippets[doc].add(ident)

        es.index(index='snippets', doc_type='snippet', id=ident, body={
            'text': text, 'document': doc,
        })
        print(ident)

for doc, snippetset in snippets.items():
    es.index(index='documents', doc_type='document', body={
        'sub': sorted(snippetset),
    })
    print(doc)

print('... done.')
