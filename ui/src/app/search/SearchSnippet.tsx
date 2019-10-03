import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import SnippetListItem from "../common/SnippetListItem";

type SearchSnippetProps = RouteComponentProps & {
    id: string,
    text: string
}

export class SearchSnippet extends React.Component<SearchSnippetProps, any> {
    render() {
        return (
            <SnippetListItem id={this.props.id} text={this.props.text}>
                <Link className="btn btn-primary btn-sm float-right"
                      to={`/documents/${this.props.id.replace(/_clipped.*/, '')}/`}>
                    <span>Bekijk document</span>
                    &nbsp;
                    <FontAwesome name='chevron-right '/>
                </Link>
            </SnippetListItem>
        );
    }
}

export default withRouter(SearchSnippet);