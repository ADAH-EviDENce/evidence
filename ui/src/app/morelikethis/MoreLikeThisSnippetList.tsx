import * as React from "react";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import MoreLikeThisSnippet from "./MoreLikeThisSnippet";
import {MoreLikeThisOption} from "./MoreLikeThisOption";

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

        Resources.getMoreLikeThisSnippets(this.props.snippetId, this.props.from).then((json) => {
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch more like this snippets.'});
        });
    };

    handleSelect = (id: string, relevant: MoreLikeThisOption) => {
        const answers = this.state.answers;

        this.addOrEditChoice(answers, id, relevant);

        this.setState(answers, () => {
            if(this.state.answers.length === this.state.snippets.hits.hits.length) {
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
        if(answer) {
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