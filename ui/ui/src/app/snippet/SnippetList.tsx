import * as React from "react";
import './SnippetList.css';

class SnippetList extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        let items = this.props.children;
        const noItems = Array.isArray(this.props.children) && this.props.children.length === 0;
        if (noItems) {
            items = <li className="list-group-item">
                <p className="text-center mt-2">Geen fragmenten.</p>
            </li>;
        }

        return (
            <div className="snippet-list list-group">{items}</div>
        );
    }
}

export default SnippetList;