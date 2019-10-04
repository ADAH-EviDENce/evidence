import * as React from "react";
import SnippetListItem from "../common/SnippetListItem";
import MoreLikeThisButton from "../common/MoreLikeThisButton";

interface SearchSnippetProps {
    id: string,
    text: string
    onDeselect: Function,
    documentId: string
}

export class SeedSetSnippet extends React.Component<SearchSnippetProps, any> {

    render() {
        return (
            <SnippetListItem id={this.props.id} text={this.props.text} >
                <span className="float-right">
                    <button className="btn btn-danger btn-sm mr-2" onClick={() => this.props.onDeselect()}>
                        <i className='fa fa-trash'/>
                    </button>
                    <MoreLikeThisButton id={this.props.id} documentId={this.props.documentId} />
                </span>
            </SnippetListItem>
        );
    }
}

export default SeedSetSnippet;