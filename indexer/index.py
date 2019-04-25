#!/usr/bin/env python3

import json
from io import StringIO
import os
import re
import sys

import elasticsearch


NUM_PARTS = re.compile(r'(\d+)')


def natural_key(s):
    '''Key function for natural sort.'''
    return [int(part) if part.isdigit() else part for part in NUM_PARTS.split(s)]


es = elasticsearch.Elasticsearch(*sys.argv[1:])

es.indices.delete(['documents', 'snippets'])

# Documents are lists of snippets.
es.indices.create('documents', ignore=400, body={
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
es.indices.create('snippets', ignore=400, body={
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

for d in os.listdir('data/text_preserve_paragraph'):
    print(d)
    dirpath = os.path.join('data', 'text_preserve_paragraph', d)

    data = StringIO()
    files = os.listdir(dirpath)

    if len(files) == 0:
        continue

    files.sort(key=natural_key)
    texts = [open(os.path.join(dirpath, f)).read() for f in files]

    assert files[0].endswith('_text.txt')
    files = [name[:-9] for name in files]

    for i, name in enumerate(files):
        json.dump({'index': {'_id': name}}, data)
        data.write('\n')

        path = os.path.join('data', 'lemma_preserve_paragraph', d,
                            name + '_lemma.txt')
        lemma = open(path).read()

        json.dump({'text': texts[i], 'lemma': lemma, 'document': d}, data)
        data.write('\n')

    snippets = [name[len(d)+1:] if name.startswith(d) else name
                for name in files]

    assert d.endswith('_clipped')
    docid = d[:-len('_clipped')]

    es.index(index='documents', doc_type='document', id=docid, body={
        'sub': files,
    })
    es.bulk(index='snippets', doc_type='snippet', body=data.getvalue())

print('Indexing done.')
