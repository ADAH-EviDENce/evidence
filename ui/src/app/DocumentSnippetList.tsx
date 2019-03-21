import * as React from "react";
import FontAwesome from "react-fontawesome";

interface DocumentSnippetListProps {
    snippetIds: Array<number>
}


class DocumentSnippetList extends React.Component<DocumentSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            snippets: null
        };
    }

    render() {
        // spinner:
        if(!this.state.snippets) {
            return <ul className="list-group list-group-flush">
                <li className="list-group-item"><FontAwesome name='spinner' spin/></li>
            </ul>;
        }

        // list:
        return (
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Cras justo odio</li>
                <li className="list-group-item">Dapibus ac facilisis in</li>
                <li className="list-group-item">Vestibulum at eros</li>
            </ul>
        );
    }
}

export default DocumentSnippetList;