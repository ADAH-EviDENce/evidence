import * as React from "react";
import {Card, CardBody, CardFooter, CardHeader} from "reactstrap";
import './MoreLikeThisSnippet.css';
import FontAwesome from "react-fontawesome";
import {MoreLikeThisOption} from "./MoreLikeThisOption";

interface MoreLikeThisSnippetProps {
    id: string,
    text: string
    onSelect: ((id: string, choice: MoreLikeThisOption) => void)
    choice: MoreLikeThisOption
}

class MoreLikeThisSnippet extends React.Component<MoreLikeThisSnippetProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    onClickYes = () => {
        this.props.onSelect(this.props.id, MoreLikeThisOption.YES);
    };

    onClickNo = () => {
        this.props.onSelect(this.props.id, MoreLikeThisOption.NO);
    };

    onClickMaybe = () => {
        this.props.onSelect(this.props.id, MoreLikeThisOption.MAYBE);
    };

    render() {
        return (
            <Card className="more-like-this-snippet">
                <CardBody>
                    <span className="small"><strong>Snippet: {this.props.id}</strong></span>
                    <p className="small snippet-text">{this.props.text}</p>
                </CardBody>
                <CardFooter>
                    <span>Bevat dit fragment een geweldsincident?</span>
                    <div className="float-right btn-group btn-group-sm" role="group">
                        <button type="button"
                                className={`btn btn-outline-success ${this.props.choice === MoreLikeThisOption.YES ? "active" : ""}`}
                                onClick={this.onClickYes}>
                            Ja
                            &nbsp;
                            <FontAwesome name='thumbs-o-up'/>
                        </button>
                        <button type="button"
                                className={`btn btn-outline-danger ${this.props.choice === MoreLikeThisOption.NO ? "active" : ""}`}
                                onClick={this.onClickNo}>
                            Nee
                            &nbsp;
                            <FontAwesome name='thumbs-o-down'/>
                        </button>
                        <button type="button"
                                className={`btn btn-outline-secondary ${this.props.choice === MoreLikeThisOption.MAYBE ? "active" : ""}`}
                                onClick={this.onClickMaybe}>
                            Blanco
                            &nbsp;
                            <FontAwesome name='question '/>
                        </button>
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

export default MoreLikeThisSnippet;