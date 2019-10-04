import * as React from "react";
import SeedSetSnippet from "./SeedSetSnippet";
import SnippetList from "../common/SnippetList";

interface SnippetListProps {
    snippets: Array<any>,
    onDeselect: Function
}

export class SeedSnippetList extends React.Component<SnippetListProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        if (!this.props.snippets) {
            return null;
        }
        return (
            <SnippetList>
                {this.props.snippets.map((s: any, i: number) => {
                    return <SeedSetSnippet
                        key={i}
                        id={s._id}
                        text={s.highlight ? s.highlight.text[0] : s._source.text}
                        onDeselect={() => this.props.onDeselect(s._id)}
                        documentId={s._source.document}
                    />
                })}
            </SnippetList>
        );
    }
}

export default SeedSnippetList;

