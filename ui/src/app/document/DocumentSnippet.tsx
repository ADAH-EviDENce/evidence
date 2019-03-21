import * as React from "react";

interface DocumentSnippetProps {
    id: number
}

class DocumentSnippet extends React.Component<DocumentSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="document-snippet">document snippet</div>
        );
    }
}

export default DocumentSnippet;