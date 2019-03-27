import * as React from "react";
import SearchSnippet from "./SearchSnippet";

interface SnippetListProps {
    snippets: Array<any>
}

export class SearchSnippetList extends React.Component<SnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }


    render() {
        if (!this.props.snippets) {
            return null;
        }
        return (
            <div className="snippet-list">
                {this.props.snippets.map((s: any, i: number) => {
                    return <SearchSnippet key={i} id={s._id} text={s.highlight ? s.highlight.text[0] : ''}/>
                })}
            </div>
        );
    }
}

export default SearchSnippetList;