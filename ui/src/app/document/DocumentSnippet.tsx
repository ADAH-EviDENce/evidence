import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";

type PropsType = RouteComponentProps & {
    id: string,
    documentId: string,
    text: string
}

class DocumentSnippet extends React.Component<PropsType, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleMoreLikeThis = () => {
        this.props.history.push(`/documents/${this.props.documentId}/snippets/${this.props.id}/`);
    };

    render() {
        return (
            <li
                className="list-group-item"
            >
                <button className="btn btn-primary btn-sm float-right" onClick={this.handleMoreLikeThis}>
                    <span>More like this</span>
                    &nbsp;
                    <FontAwesome name='chevron-right '/>
                </button>
                <p className="small"><strong>{this.props.id}</strong></p>
                <p className="small">{this.props.text}</p>
            </li>
        );
    }
}

export default withRouter(DocumentSnippet);