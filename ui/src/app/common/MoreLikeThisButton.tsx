import * as React from "react";
import {Button} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";

export type MoreLikeThisButtonProps = RouteComponentProps & {
    id: string
    documentId: string
}

class MoreLikeThisButton extends React.Component<MoreLikeThisButtonProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleMoreLikeThis = () => {
        this.props.history.push(`/documents/${this.props.documentId}/snippets/${this.props.id}/from/0/`);
    };


    render() {
        return (
            <Button color="primary" size="sm" onClick={this.handleMoreLikeThis}>
                More like this
                <i className='fa fa-chevron-right ml-1'/>
            </Button>
        );
    }
}

export default withRouter(MoreLikeThisButton);