import * as React from "react";
import Page from "../common/Page";
import ErrorBox from "../common/ErrorBox";
import Resources from "../Resources";
import {Card, CardHeader} from "reactstrap";
import DocumentSnippet from "../document/DocumentSnippet";
import MoreLikeThisSnippetList from "./MoreLikeThisSnippetList";

class MoreLikeThis extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};

        this.fetchSnippets();
    }

    fetchSnippets = () => {
        if(this.state.snippet || this.state.error) {
            return;
        }
        Resources.getDocumentSnippets([{_id: this.props.match.params.sid}]).then((json) => {
            let docs = json.docs;
            this.setState({snippet: docs ?  docs[0] : null});
        }).catch((data) => {
            this.setState({error: 'Could not fetch snippet by id.'});
        });

    };

    render() {

        let snippetId = this.props.match.params.sid;
        let documentId = this.props.match.params.did;

        return (
            <Page>
                <div className="offset-2 col-8">
                    <div className="more-like-this">
                        <h2>Geselecteerd</h2>
                        <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                        <Card>
                            <CardHeader>
                                Document: {documentId}
                            </CardHeader>
                            <DocumentSnippet
                                    id={snippetId}
                                    documentId={documentId}
                                    text={this.state.snippet ? this.state.snippet._source.text : null}
                                    moreLikeThis={false}
                            />
                        </Card>
                        <h2>Te beoordelen</h2>
                        <MoreLikeThisSnippetList snippetId={snippetId}/>
                    </div>
                </div>
            </Page>
        );
    }
}

export default MoreLikeThis;