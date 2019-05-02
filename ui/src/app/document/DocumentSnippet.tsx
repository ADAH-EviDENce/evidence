import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";
import {Card, CardBody, CardHeader} from "reactstrap";
import './DocumentSnippet.css';
import ReadableId from "../common/ReadableId";
import {AppContext} from "../AppContext";

type PropsType = RouteComponentProps & {
    id: string,
    text: string,
    documentId: string,
    moreLikeThis: boolean
}

class DocumentSnippet extends React.Component<PropsType, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleMoreLikeThis = () => {
        this.props.history.push(`/documents/${this.props.documentId}/snippets/${this.props.id}/from/0/`);
    };

    render() {
        let moreLikeThis = this.props.moreLikeThis
            ?
            <button className="btn btn-primary btn-sm float-right" onClick={this.handleMoreLikeThis}>
                <span>More like this ({this.context.moreLikeThisType})</span>
                &nbsp;
                <FontAwesome name='chevron-right '/>
            </button>
            :
            null;

        return (
            <div className="document-snippet">
                <Card>
                    <CardHeader>
                        {moreLikeThis}
                        <span className="small">
                            <strong>Fragment: <ReadableId id={this.props.id} toRemove={this.props.documentId} /></strong></span>
                    </CardHeader>
                    <CardBody>
                        <p className="small">{this.props.text}</p>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
DocumentSnippet.contextType = AppContext;


export default withRouter(DocumentSnippet);