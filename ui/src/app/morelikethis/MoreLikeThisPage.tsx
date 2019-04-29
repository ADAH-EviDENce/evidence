import * as React from "react";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import Resources from "../Resources";
import DocumentSnippet from "../document/DocumentSnippet";
import MoreLikeThisSnippetList from "./MoreLikeThisSnippetList";
import FontAwesome from "react-fontawesome";
import './MoreLikeThisPage.css';
import MoreLikeThisCommitModal from "./MoreLikeThisCommitModal";
import ReadableId from "../common/ReadableId";
import {AppContext} from "../AppContext";
import {Link} from "react-router-dom";

class MoreLikeThisPage extends React.Component<any, any> {
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
            this.setState({error: 'De fragmenten konden niet worden gevonden op basis van ID.'});
        });

    };

    handleAllSnippetsHaveAnswers = (answers: Array<any>) => {
        this.setState({answers, canCommit: true});
    };

    handleCommit = () => {
        this.setState({committing: true});
        Resources.commitAnswers(this.state.answers, this.context.user).then(() => {
            this.setState({committed: true, committing: false});
        }).catch((data) => {
            this.setState({error: 'De antwoorden konden niet worden opgeslagen.', committing: false});
        });
    };

    private renderScoreForm(from: number, snippetId: string, documentId: string) {
        return <>
            <h2>Te beoordelen (#{from + 1}-{from + parseInt(this.context.moreLikeThisSize)})</h2>
            <MoreLikeThisSnippetList
                snippetId={snippetId}
                docId={documentId}
                from={from}
                onAllSnippetsHaveAnswers={this.handleAllSnippetsHaveAnswers}
            />
            <div className="commit-answers">
                <button
                    type="submit"
                    className="btn btn-success float-right commit-btn"
                    disabled={(!this.state.canCommit && !this.state.committed) || !this.context.user}
                    onClick={this.handleCommit}
                >
                    Opslaan ({this.context.user})
                    &nbsp;
                    {this.state.committing
                        ? <FontAwesome name='spinner' spin/>
                        : <FontAwesome name='chevron-right '/>
                    }
                </button>
            </div>
            <MoreLikeThisCommitModal
                documentId={documentId}
                snippetId={snippetId}
                from={from}
                answers={this.state.answers}
                committed={this.state.committed}
            />
        </>;
    }

    render() {

        let snippetId = this.props.match.params.sid;
        let documentId = this.props.match.params.did;
        let from = parseInt(this.props.match.params.from);

        return (
            <Page>
                <div className="more-like-this">
                    <h2><ReadableId id={documentId}/></h2>
                    <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                    <DocumentSnippet
                        id={snippetId}
                        documentId={documentId}
                        text={this.state.snippet ? this.state.snippet._source.text : null}
                        moreLikeThis={false}
                    />

                    {this.context.user
                        ?
                        this.renderScoreForm(from, snippetId, documentId)
                        :
                        <InfoBox
                            msg={<><Link to="/user/">Selecteer</Link> eerst een gebruiker om op te kunnen
                                beoordelen.</>}
                            type='info'
                        />
                    }
                </div>
            </Page>
        );
    }

}

MoreLikeThisPage.contextType = AppContext;

export default MoreLikeThisPage;