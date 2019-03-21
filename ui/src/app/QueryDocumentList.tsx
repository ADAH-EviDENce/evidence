import * as React from "react";
import QueryDocument from "./QueryDocument";

class QueryDocumentList extends React.Component<any, any> {
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
                    return <QueryDocument key={i} id={h._id} snippetIds = {h._id} />
                })}
            </div>
        );
    }
}

export default QueryDocumentList;