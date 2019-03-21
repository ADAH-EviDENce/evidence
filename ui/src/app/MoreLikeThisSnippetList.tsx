import * as React from "react";
import Resources from "./Resources";
import ErrorBox from "./common/ErrorBox";

interface MoreLikeThisSnippetListProps {
    snippetId: string
}

class MoreLikeThisSnippetList extends React.Component<MoreLikeThisSnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    fetchSnippets = () => {
        if(this.state.snippets || this.state.error) {
            return;
        }

        Resources.getMoreLikeThisSnippets(this.props.snippetId).then((json) => {
            console.log('getMoreLikeThisSnippets', json);
            this.setState({snippets: json});
        }).catch((data) => {
            this.setState({error: 'Could not fetch more like this snippets.'});
        });

    };


    render() {
        this.fetchSnippets();

        return (
            <ul className="more-like-this-snippet-list list-group">
                <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                {JSON.stringify(this.state.snippets)}
            </ul>
        );
    }
}

export default MoreLikeThisSnippetList;