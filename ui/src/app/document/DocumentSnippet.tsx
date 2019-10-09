import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Button, Card, CardBody, CardHeader} from "reactstrap";
import './DocumentSnippet.css';
import ReadableId from "../common/ReadableId";
import {AppContext} from "../AppContext";
import Resources from "../Resources";
import MoreLikeThisButton from "../morelikethis/MoreLikeThisButton";

type DocumentSnippetProps = RouteComponentProps & {
    id: string,
    text: string,
    documentId: string,
    moreLikeThis: boolean,
    showInSeedSet: boolean
}

class DocumentSnippet extends React.Component<DocumentSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            inSeedSet: false
        };

        if(this.props.showInSeedSet) {
            this.checkInSeedSet();
        }

    }
    private checkInSeedSet() {
        Resources.checkInSeedSet(this.context.user, this.props.id).then((response) => {
            this.setState({inSeedSet: response.status === 200});
        });
    }

    handleSeedSetClick = () => {
        if(this.state.inSeedSet) {
            Resources.removeSeedId(this.context.user, this.props.id).then(() => {
                this.setState({inSeedSet: false});
            })
        } else {
            Resources.postSeedSet(this.context.user, [this.props.id]).then((response) => {
                this.setState({inSeedSet: true});
            });
        }
    };

    render() {
        let seedSetBtn = this.props.showInSeedSet
            ?
            <Button
                onClick={this.handleSeedSetClick}
                color={this.state.inSeedSet ? "danger" : "primary"}
                className="mr-3"
                size="sm"
            >
                <i className={`fas ${this.state.inSeedSet ? "fa-trash" : "fa-plus-square"} ml-1`}/>
                &nbsp;{this.state.inSeedSet ? 'Uit startset' : 'In startset'}
            </Button>
            :
            null;

        let moreLikeThisBtn = this.props.moreLikeThis
            ?
            <MoreLikeThisButton id={this.props.id} documentId={this.props.documentId}/>
            :
            null;

        return (
            <div className="document-snippet">
                <Card>
                    <CardHeader>
                        <span className="float-right">
                            {seedSetBtn}
                            {moreLikeThisBtn}
                        </span>
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