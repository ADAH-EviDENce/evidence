import * as React from "react";
import {Link} from "react-router-dom";
import SnippetListItem from "../snippet/SnippetListItem";

interface SearchSnippetProps {
    id: string,
    docid: string,
    text: string
}

export class SearchSnippet extends React.Component<SearchSnippetProps, any> {
    render() {
        return (
            <SnippetListItem id={this.props.id} text={this.props.text}>
                <Link className="ml-1 btn btn-primary btn-sm float-right"
                      to={`/documents/${this.props.docid}/`}>
                    <span>View document</span>
                    &nbsp;
                    <i className='fa fa-chevron-right '/>
                </Link>
            </SnippetListItem>
        );
    }
}

export default SearchSnippet;
