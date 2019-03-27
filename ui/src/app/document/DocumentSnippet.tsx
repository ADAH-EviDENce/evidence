import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";
import {Card, CardBody, CardHeader} from "reactstrap";
import './DocumentSnippet.css';

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
                <span>More like this</span>
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
                        <p className="small">
                            <strong>Fragment: {this.props.id.replace(this.props.documentId, '[..]')}</strong></p>
                    </CardHeader>
                    <CardBody>
                        <p className="small">{this.props.text}</p>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default withRouter(DocumentSnippet);