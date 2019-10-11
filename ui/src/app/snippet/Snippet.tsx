import * as React from "react";
import ReadableId from "../common/ReadableId";

interface SnippetProps {
    id: string,
    text: string
}

class Snippet extends React.Component<SnippetProps, any> {
    render() {
        return (
            <>
                <div className="small snippet-title">
                    <strong><ReadableId id={this.props.id}/></strong>
                </div>
                <p className="small snippet-text" dangerouslySetInnerHTML={{ __html: this.props.text }} />
            </>
        );
    }
}

export default Snippet;