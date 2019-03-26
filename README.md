# Evidence

## Deploy locally

### Obtain TargetSize150.zip
Unzip TargetSize150.zip

### Create single data directory for all models / input data
mv TargetSize150 data

### Obtain doc2vec.csv, then store in data directory
mv doc2vec.csv data/

Run: `DATA=./data docker-compose up --build`

## Elastic search example query
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

## Doc2Vec 'More like this' example query
    curl http://localhost:8080/doc2vec/$id

### Paging for 'doc2vec' uses 'from' (default 0) and 'size' (default 10)
    curl http://localhost:8080/doc2vec/$id?from=3&size=8
