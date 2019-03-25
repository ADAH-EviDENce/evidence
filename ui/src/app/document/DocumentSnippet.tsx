import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";

type PropsType = RouteComponentProps & {
    id: string,
    text: string,
    documentId: string,
    moreLikeThis: boolean
}

class DocumentSnippet extends React.Component<PropsType, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleMoreLikeThis = () => {
        this.props.history.push(`/documents/${this.props.documentId}/snippets/${this.props.id}/from/0/`);
    };

    render() {
        let moreLikeThis = this.props.moreLikeThis
            ?
            <button className="btn btn-primary btn-sm float-right" onClick={this.handleMoreLikeThis}>
                <span>More like this</span>
                &nbsp;
                <FontAwesome name='chevron-right '/>
            </button>
            :
            null;

        return (
            <li
                className="list-group-item"
            >
                {moreLikeThis}
                <p className="small"><strong>Snippet: {this.props.id.replace(this.props.documentId, '[..]')}</strong></p>
                <p className="small">{this.props.text}</p>
            </li>
        );
    }
}

export default withRouter(DocumentSnippet);