import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";
import './SearchSnippet.css';
import {Link} from "react-router-dom";
import ReadableId from "../common/ReadableId";

type SearchSnippetProps = RouteComponentProps & {
    id: string,
    text: string
}

export class DocumentSnippet extends React.Component<SearchSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleSeeDocument = () => {
        this.props.history.push(`/documents/${this.props.id}/`);
    };

    render() {
        return (
            <li
                className="search-snippet list-group-item"
            >
                <Link className="btn btn-primary btn-sm float-right" to={`/documents/${this.props.id.replace(/_clipped.*/, '')}/`}>
                    <span>Bekijk document</span>
                    &nbsp;
                    <FontAwesome name='chevron-right '/>
                </Link>

                <p className="small snippet-title"><strong><ReadableId id={this.props.id}/></strong></p>
                <p className="small snippet-text" dangerouslySetInnerHTML={{ __html: this.props.text }} />
            </li>
        );
    }
}

export default withRouter(DocumentSnippet);