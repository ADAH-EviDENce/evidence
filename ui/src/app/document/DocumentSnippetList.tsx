import * as React from "react";
import FontAwesome from "react-fontawesome";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import DocumentSnippet from "./DocumentSnippet";

interface DocumentSnippetListProps {
    documentId: string,
    snippetIds: Array<number>,
    isOpen: boolean
}

class DocumentSnippetList extends React.Component<DocumentSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            snippets: null
        };
    }

    fetchSnippets = () => {
        if (!this.props.snippetIds || !this.props.isOpen || this.state.snippets) {
            return;
        }

        Resources.getDocumentSnippets(this.props.snippetIds).then((json) => {
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch snippets with provided query.'});
        });

    };

    private renderSnippets() {
        return <>
            {this.state.snippets.docs.map((s: any, i: number) => {
                return <DocumentSnippet key={i} id={s._id} text={s._source.text} documentId={this.props.documentId}/>
            })}
        </>;
    }

    render() {
        this.fetchSnippets();

        let listElements = this.state.snippets
            ?
            this.renderSnippets()
            :
            <li className="list-group-item"><FontAwesome name='spinner' spin/></li>;

        return (
            <div>
                <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                <ul className="list-group list-group-flush">
                    {listElements}
                </ul>
            </div>
        );
    }
}

export default DocumentSnippetList;