List of snippets:

    http://localhost:8080/es/snippets/_search

Single snippet:

    http://localhost:8080/es/snippets/snippet/$id

More like this:

    curl -XGET http://localhost:8080/es/snippets/_search -d '{
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
                    "_id": "'${id}'",
                }],
            },
        },
    }'
