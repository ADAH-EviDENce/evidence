import * as React from "react";
import Page from "../common/Page";
import ErrorBox from "../common/ErrorBox";
import Resources from "../Resources";
import DocumentSnippet from "../document/DocumentSnippet";
import MoreLikeThisSnippetList from "./MoreLikeThisSnippetList";
import FontAwesome from "react-fontawesome";
import './MoreLikeThis.css';
import MoreLikeThisCommitModal from "./MoreLikeThisCommitModal";
import config from "../../config";
import ReadableId from "../common/ReadableId";
import {AppContext} from "../AppContext";

class MoreLikeThis extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            answers: [],
            canCommit: false,
            committing: false,
            committed: false
        };

        this.fetchSnippets();
    }

    fetchSnippets = () => {
        if (this.state.snippet || this.state.error) {
            return;
        }

        Resources.getSnippetsByIds([{_id: this.props.match.params.sid}]).then((json) => {
            let docs = json.docs;
            this.setState({snippet: docs ? docs[0] : null});
        }).catch((data) => {
            this.setState({error: 'Could not fetch snippet by id.'});
        });

    };

    handleAllSnippetsHaveAnswers = (answers: Array<any>) => {
        this.setState({answers, canCommit: true});
    };

    handleCommit = () => {
        this.setState({committing: true});
        Resources.commitAnswers(this.state.answers).then(() => {
            this.setState({committed: true, committing: false});
        }).catch((data) => {
            this.setState({error: 'Could not commit answers.', committing: false});
        });
    };

    render() {

        let snippetId = this.props.match.params.sid;
        let documentId = this.props.match.params.did;
        let from = parseInt(this.props.match.params.from);

        return (
            <Page>
                <div className="more-like-this">
                    <h2><ReadableId id={documentId}/></h2>
                    <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                    <DocumentSnippet
                        id={snippetId}
                        documentId={documentId}
                        text={this.state.snippet ? this.state.snippet._source.text : null}
                        moreLikeThis={false}
                    />
                    <h2>Te beoordelen (#{from + 1}-{from + parseInt(this.context.moreLikeThisSize)})</h2>
                    <MoreLikeThisSnippetList
                        snippetId={snippetId}
                        from={from}
                        onAllSnippetsHaveAnswers={this.handleAllSnippetsHaveAnswers}
                    />
                    <div className="commit-answers">
                        <button
                            type="submit"
                            className="btn btn-success float-right commit-btn"
                            disabled={!this.state.canCommit && !this.state.committed}
                            onClick={this.handleCommit}
                        >
                            Opslaan
                            &nbsp;
                            {this.state.committing ? <FontAwesome name='spinner' spin/> :
                                <FontAwesome name='chevron-right '/>}
                        </button>
                    </div>
                    <MoreLikeThisCommitModal
                        documentId={documentId}
                        snippetId={snippetId}
                        from={from}
                        answers={this.state.answers}
                        committed={this.state.committed}
                    />
                </div>
            </Page>
        );
    }
}
MoreLikeThis.contextType = AppContext;

export default MoreLikeThis;