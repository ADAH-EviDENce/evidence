import * as React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";
import './MoreLikeThisSnippet.css';
interface MoreLikeThisSnippetProps {
    id: string,
    text: string
}

class MoreLikeThisSnippet extends React.Component<MoreLikeThisSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Card className="more-like-this-snippet">
                <CardHeader>
                    <strong>Snippet: {this.props.id}</strong>
                </CardHeader>
                <CardBody>
                    <p>{this.props.text}</p>
                </CardBody>
            </Card>
        );
    }
}

export default MoreLikeThisSnippet;