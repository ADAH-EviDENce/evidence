# Evidence user interface

User interface consists of

* a web service written in Go language in current folder.
* a single page web application written in React in `ui/` folder.

## Run

See [/README.md#build-the-user-interface-web-application-and-start-it](/README.md#build-the-user-interface-web-application-and-start-it).

## Elasticsearch example queries

List of snippets:

    http://localhost:8080/es/snippets/_search

Single snippet:

    http://localhost:8080/es/snippets/snippet/$id

More like this:

    curl -XGET -H 'Content-Type: application/json' \
        http://localhost:8080/es/snippets/_search -d '{
        "query": {
            "more_like_this": {
                "fields": ["text", "lemma"],
                "boost_terms": 1,
                "max_query_terms": 150,
                "min_doc_freq": 1,
                "min_term_freq": 1,
                "like": [{
                    "_index": "snippets",
                    "_type": "snippet",
                    "_id": "'${id}'"
                }]
            }
        }
    }'

## Doc2Vec example queries

More like this:

    curl http://localhost:8080/doc2vec/$id

Paging in `doc2vec` is done using request parameters `from` (default `0`) and `size` (default `10`)

    curl http://localhost:8080/doc2vec/$id?from=3&size=8

## Legal matters

Copyright 2016-2019 Koninklijke Nederlandse Academie van Wetenschappen

Distributed under the terms of the GNU General Public License, version 3.
See the file LICENSE for details.
