import * as React from "react";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import MoreLikeThisSnippet from "./MoreLikeThisSnippet";

interface MoreLikeThisSnippetListProps {
    snippetId: string
}

class MoreLikeThisSnippetList extends React.Component<MoreLikeThisSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
        this.fetchSnippets();
    }

    fetchSnippets = () => {
        if (this.state.snippets || this.state.error) {
            return;
        }

        Resources.getMoreLikeThisSnippets(this.props.snippetId).then((json) => {
            console.log('getMoreLikeThisSnippets', json);
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch more like this snippets.'});
        });

    };


    private renderSnippets() {
        if (!this.state.snippets) {
            return null;
        }
        console.log('snippets', this.state.snippets);
        return this.state.snippets.hits.hits.map((s: any, i: number) => {
            return <MoreLikeThisSnippet key={i} id={s._id} text={s._source.text}/>
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