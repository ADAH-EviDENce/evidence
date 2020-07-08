import * as React from "react";
import {Card, CardHeader, Collapse} from "reactstrap";
import DocumentSnippetList from "./DocumentSnippetList";

interface QueryDocumentProps {
    id: string;
    snippetIds: Array<number>
}

class Document extends React.Component<QueryDocumentProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.toggle = this.toggle.bind(this);
        this.state = {collapse: false};
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader onClick={this.toggle}>
                        <button className="btn btn-primary btn-sm float-right">
                            <i className='fa fa-plus-square-o'/>
                            &nbsp;
                            <span>Snippets</span>
                        </button>
                        Document {this.props.id}
                    </CardHeader>
                    <Collapse isOpen={this.state.collapse}>
                        <DocumentSnippetList isOpen={this.state.collapse} snippetIds={this.props.snippetIds} documentId={this.props.id}/>
                    </Collapse>

                </Card>
            </div>
        );
    }
}

export default Document;