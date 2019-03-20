import * as React from "react";
import {ES_HOST} from "../config";

class DocumentResource {
    public static getDocuments = (query: string) => {
        return fetch(ES_HOST + "/" + query);
    }
}

export default DocumentResource;