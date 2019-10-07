import * as React from "react";
import './SnippetListItem.css';
import Snippet from "./Snippet";

interface SnippetListItemProps {
    id: string,
    text: string
}

export class SnippetListItem extends React.Component<SnippetListItemProps, any> {
    render() {
        return (
            <li
                className="snippet-list-item list-group-item"
            >
                {this.props.children}
                <Snippet id={this.props.id} text={this.props.text}/>
            </li>
        );
    }
}

export default SnippetListItem;