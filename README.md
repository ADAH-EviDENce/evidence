# Evidence

## Deploy locally

Create single data directory for all models / input data

    mkdir data

Obtain `TargetSize150.zip`, unpack and move into data directory

    unzip -qq TargetSize150.zip && mv TargetSize150/* data && rmdir TargetSize150

Obtain `doc2vec.csv`, then store in data directory

    mv doc2vec.csv data

## Run

After local deploy (as per above)

    DATA=./data docker-compose up --build

## Elastic search example queries
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
