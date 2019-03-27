import * as React from "react";
import {ASSESS_HOST, ES_HOST, MORE_LIKE_THIS_SIZE} from "../config";
import elasticsearch from 'elasticsearch';

class Resources {

    public static getDocuments = (query: string) => {
        return fetch(ES_HOST + "/" + query);
    };

    public static getDocumentSnippets = (docs: Array<any>) => {
        const client = new elasticsearch.Client({
            host: ES_HOST + "/snippets/snippet",
            log: 'error'
        });
        return client.mget({body: {docs: docs}});
    };

    public static getMoreLikeThisSnippets = (
        snippetId: string,
        from: number,
        size: number = MORE_LIKE_THIS_SIZE
    ) => {
        const client = new elasticsearch.Client({
            host: ES_HOST + "/snippets",
            log: 'error'
        });
        return client.search({
            body: {
                size: size,
                from: from,
                query: {
                    more_like_this: {
                        fields: ["text", "lemma"],
                        boost_terms: 1,
                        max_query_terms: 150,
                        min_doc_freq: 1,
                        min_term_freq: 1,
                        like: [{
                            _index: "snippets",
                            _type: "snippet",
                            _id: snippetId
                        }]
                    }
                }
            }
        });
    };

    public static commitAnswers = (answers: Array<any>) => {
        return fetch(ASSESS_HOST, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(answers)
        });
    }
}

export default Resources;