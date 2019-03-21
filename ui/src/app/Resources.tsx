import * as React from "react";
import {ES_HOST} from "../config";
import elasticsearch from 'elasticsearch';

class Resources {

    public static getDocuments = (query: string) => {
        return fetch(ES_HOST + "/" + query);
    };

    /**
     * curl \
     *   http://localhost:8080/es/snippets/snippet/_mget \
     *   -XGET -H "Content-Type: application/json" \
     *   -d '{"docs": [{"_id": "GV_Verhalis_kloosterzusters_04b_conversation_clipped_150_paragraph_1-8"}]}'
     */
    public static getDocumentSnippets = (docs: Array<any>) => {
        const client = new elasticsearch.Client({
            host: ES_HOST + "/snippets/snippet",
            log: 'trace'
        });
        return client.mget({body: {docs: docs}});
    }
}

export default Resources;