import * as React from "react";
import Resources from "../Resources";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import DocumentSnippetList from "./DocumentSnippetList";
import ReadableId from "../common/ReadableId";
import {AppContext} from "../AppContext";

class DocumentPage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            loading: true,
            snippets: null
        };
        this.getSnippets(this.props.match.params.did);
    }

    getSnippets = (documentId: string) => {
        Resources.getSnippetsByDocumentId(documentId).then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({snippets: json, loading: false});
            });
        }).catch((data) => {
            this.setState({
                loading: false,
                error: 'Er konden geen documenten gevonden worden op basis van de opgegeven zoektermen.'
            });
        });

    };

    private renderDocument() {
        if (!this.state.snippets || this.state.loading) {
            return null;
        }
        return <div className="query-document-list">
            <DocumentSnippetList isOpen={true} snippetIds={this.state.snippets._source.sub.map(
                (s: number) => {
                    return {_id: s}
                }
            )} documentId={this.props.match.params.did}/>
        </div>;
    }

    render() {
        const documentId = this.props.match.params.did;
        const breadcrumbTrail = [
            {text: "zoeken", path: "/search/"},
            {text: this.context.search, path: `/search/${this.context.search}/`},
            {text: <ReadableId id={documentId} lowercase/>, path: `/documents/${documentId}/`},
        ];

        return (
            <Page
                breadcrumbTrail={breadcrumbTrail}
            >
                <div className="document-page">
                    <h3><ReadableId id={documentId}/></h3>
                    <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                    {this.renderDocument()}
                </div>
            </Page>
        );
    }
}

DocumentPage.contextType = AppContext;


export default DocumentPage;