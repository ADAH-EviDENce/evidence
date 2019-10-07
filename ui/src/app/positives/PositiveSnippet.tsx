import * as React from "react";
import SnippetListItem from "../snippet/SnippetListItem";
import MoreLikeThisButton, {MoreLikeThisButtonProps} from "../common/MoreLikeThisButton";
import {withRouter} from "react-router";

type PositiveSnippetProps = MoreLikeThisButtonProps & {
    text: string
}

class PositiveSnippet extends React.Component<PositiveSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <SnippetListItem id={this.props.id} text={this.props.text} >
                <span className="float-right">
                    <MoreLikeThisButton id={this.props.id} documentId={this.props.documentId} />
                </span>
            </SnippetListItem>
        );
    }
}

export default withRouter(PositiveSnippet);