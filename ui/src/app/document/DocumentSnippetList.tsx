import * as React from "react";
import Resources from "../Resources";
import InfoBox from "../common/InfoBox";
import DocumentSnippet from "./DocumentSnippet";
import Spinner from "../common/Spinner";

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

        Resources.getSnippetsByIds(this.props.snippetIds).then((json) => {
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Er konden geen fragmenten gevonden worden op basis van de opgegeven zoektermen.'});
        });

    };

    private renderSnippets() {
        return <>
            {this.state.snippets.docs.map((s: any, i: number) => {
                return <DocumentSnippet
                    key={i}
                    id={s._id}
                    documentId={this.props.documentId}
                    text={s._source ? s._source.text : '-'}
                    moreLikeThis={true}
                    showInSeedSet={true}
                />
            })}
        </>;
    }

    render() {
        this.fetchSnippets();

        let listElements = this.state.snippets
            ? this.renderSnippets()
            : <li className="list-group-item"><Spinner /></li>;

        return (
            <div>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                {listElements}
            </div>
        );
    }
}

export default DocumentSnippetList;