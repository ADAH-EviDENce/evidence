import * as React from "react";
import Document from "./Document";
import './DocumentList.css';

class DocumentList extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false};
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    render() {
        if (!this.props.documents) {
            return null;
        }
        return (
            <div className="query-document-list">
                {this.props.documents.hits.hits.map((h: any, i: number) => {
                    return <Document key={i} id={h._id} snippetIds = {h._source.sub.map((s: number) => {return {_id: s}})} />
                })}
            </div>
        );
    }
}

export default DocumentList;