import * as React from "react";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import MoreLikeThisSnippet from "./MoreLikeThisSnippet";
import {MoreLikeThisOption} from "./MoreLikeThisOption";

interface MoreLikeThisSnippetListProps {
    snippetId: string
}

class MoreLikeThisSnippetList extends React.Component<MoreLikeThisSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {answers: []};
        this.fetchSnippets();
    }

    fetchSnippets = () => {
        if (this.state.snippets || this.state.error) {
            return;
        }

        Resources.getMoreLikeThisSnippets(this.props.snippetId).then((json) => {
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch more like this snippets.'});
        });

    };

    handleSelect = (id: string, choice: MoreLikeThisOption) => {
        const answers = this.state.answers;
        const answerById = answers.find((a: any) => a.id === id);
        if(answerById) {
            answerById.choice = choice;
        } else {
            answers.push({id, choice});
        }
        this.setState(answers);
    };

    private findChoice(id: number) {
        let answer = this.state.answers.find((a: any) => a.id === id);
        if(answer) {
            return answer.choice;
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
                choice={this.findChoice(s._id)}
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