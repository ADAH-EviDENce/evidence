import * as React from "react";
import elasticsearch from 'elasticsearch';
import config from "../config";

class Resources {

    public static getSnippetsByDocumentId = (documentId: string) => {
        return fetch(config.ES_HOST + "/documents/document/" + documentId);
    };

    public static searchSnippets = (
        query: string,
        from: number,
        size: number
    ) => {
        const client = new elasticsearch.Client({
            host: config.ES_HOST + "/snippets",
            log: 'error'
        });
        return client.search({
            body: {
                size: size,
                from: from,
                query: {
                    query_string: {query: query}
                },
                highlight: {
                    fields: {
                        text: {}
                    },
                    number_of_fragments: 1,
                    type: "unified",
                    fragment_size: 2000
                }
            }

        });
    };

    public static getSnippetsByIds = (docs: Array<any>) => {
        const client = new elasticsearch.Client({
            host: config.ES_HOST + "/snippets/snippet",
            log: 'error'
        });
        return client.mget({body: {docs: docs}});
    };

    public static getMoreLikeThisSnippetsFromES = (
        snippetId: string,
        from: number,
        size: number
    ) => {
        const client = new elasticsearch.Client({
            host: config.ES_HOST + "/snippets",
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

    public static getMoreLikeThisSnippetsFromDoc2Vec = (
        snippetId: string,
        from: number,
        size: number
    ) => {
        return fetch(`${config.DOC2VEC_HOST}/${snippetId}?from=${from}&size=${size}`);
    };

    public static commitAnswers = (answers: Array<any>, user: string) => {
        return fetch(config.ASSESS_HOST, {
            method: 'POST',
            headers: {
                "Authorization": `Username ${user}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(answers)
        });
    };

    static getUsers() {
        return fetch(config.USERS_HOST);
    }
}

export default Resources;