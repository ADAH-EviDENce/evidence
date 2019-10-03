import * as React from "react";
import ReadableId from "./ReadableId";

interface SnippetProps {
    id: string,
    text: string
}

class Snippet extends React.Component<SnippetProps, any> {
    render() {
        return (
            <>
                <p className="small snippet-title"><strong><ReadableId id={this.props.id}/></strong></p>
                <p className="small snippet-text" dangerouslySetInnerHTML={{ __html: this.props.text }} />
            </>
        );
    }
}

export default Snippet;