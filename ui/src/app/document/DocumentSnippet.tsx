import * as React from "react";
import FontAwesome from "react-fontawesome";
import {RouteComponentProps, withRouter} from "react-router";
import {Button, Card, CardBody, CardHeader} from "reactstrap";
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
            <Button color="primary" size="sm" className='float-right' onClick={this.handleMoreLikeThis}>
                More like this
                <FontAwesome name='chevron-right ml-1'/>
            </Button>
            :
            null;

        return (
            <div className="document-snippet">
                <Card>
                    <CardHeader>
                        {moreLikeThis}
                        <span className="small">
                            <strong>Fragment: <ReadableId id={this.props.id} toRemove={this.props.documentId}/></strong></span>
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