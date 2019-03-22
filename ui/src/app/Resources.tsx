import * as React from "react";
import {ES_HOST} from "../config";
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

    public static getMoreLikeThisSnippets = (snippetId: string) => {
        const client = new elasticsearch.Client({
            host: ES_HOST + "/snippets/",
            log: 'error'
        });
        return client.search({
            body: {
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
        console.log('commitAnswers', answers);
        return fetch(ES_HOST + "/assess/", {
            method: 'POST',
            body: JSON.stringify(answers)
        });
    }
}

export default Resources;