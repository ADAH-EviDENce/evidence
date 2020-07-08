import * as React from "react";
import {Button} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";
import {MoreLikeThisType} from "../configuring/MoreLikeThisType";

export type MoreLikeThisButtonProps = RouteComponentProps & {
    id: string
    documentId: string
    type?: MoreLikeThisType
}

class MoreLikeThisButton extends React.Component<MoreLikeThisButtonProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleMoreLikeThis = () => {
        let url = `/documents/${this.props.documentId}/snippets/${this.props.id}/from/0/`;
        if(this.props.type){
            url += `type/${this.props.type}/`
        }
        this.props.history.push(url);
    };


    render() {
        return (
            <Button color="primary" size="sm" onClick={this.handleMoreLikeThis}>
                More like this {this.props.type ? `(${this.props.type})` : null}
                <i className='fa fa-chevron-right ml-1'/>
            </Button>
        );
    }
}

export default withRouter(MoreLikeThisButton);