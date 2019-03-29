import * as React from "react";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import MoreLikeThisSnippet from "./MoreLikeThisSnippet";
import {MoreLikeThisOption} from "./MoreLikeThisOption";
import config from "../../config";

interface MoreLikeThisSnippetListProps {
    snippetId: string,
    from: number,
    onAllSnippetsHaveAnswers: ((answers: Array<any>) => void)
}

class MoreLikeThisSnippetList extends React.Component<MoreLikeThisSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            // array of snippet ids and relevance
            answers: []
        };
        this.fetchSnippets();
    }

    fetchSnippets = () => {
        if (this.state.snippets || this.state.error) {
            return;
        }

        if (config.MORE_LIKE_THIS_TYPE === 'es') {
            this.fetchFromES();
        } else if (config.MORE_LIKE_THIS_TYPE === 'doc2vec') {
            this.fetchFromDoc2Vec();
        }
    };

    private fetchFromES() {
        Resources.getMoreLikeThisSnippetsFromES(this.props.snippetId, this.props.from).then((json) => {
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch more like this snippets from elasticsearch.'});
        });
    }

    private fetchFromDoc2Vec() {
        Resources.getMoreLikeThisSnippetsFromDoc2Vec(this.props.snippetId, this.props.from).then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({snippets: json, loading: false});
            });
        }).catch((data) => {
            this.setState({loading: false, error: 'Could not fetch more like this snippets from doc2vec.'});
        });
    }

    handleSelect = (id: string, relevant: MoreLikeThisOption) => {
        const answers = this.state.answers;

        this.addOrEditChoice(answers, id, relevant);

        this.setState(answers, () => {
            if (this.state.answers.length === this.state.snippets.hits.hits.length) {
                this.props.onAllSnippetsHaveAnswers(this.state.answers);
            }
        });
    };

    private addOrEditChoice(answers: Array<any>, id: string, relevant: MoreLikeThisOption) {
        const answerById = answers.find((a: any) => a.id === id);
        if (answerById) {
            answerById.relevant = relevant;
        } else {
            answers.push({id, relevant});
        }
    }

    private findRelevantById(id: number) {
        let answer = this.state.answers.find((a: any) => a.id === id);
        if (answer) {
            return answer.relevant;
        }
    }

    private renderSnippets() {
        if (!this.state.snippets) {
            return null;
        }
        return this.state.snippets.hits.hits.map((s: any, i: number) => {
            return <MoreLikeThisSnippet
                key={i}
                id={s._id}
                text={s._source.text}
                onSelect={this.handleSelect}
                relevant={this.findRelevantById(s._id)}
            />
        });
    }

    render() {
        return (
            <div className="more-like-this-snippet-list">
                <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                <div>
                    {this.renderSnippets()}
                </div>
            </div>
        );
    }
}

export default MoreLikeThisSnippetList;