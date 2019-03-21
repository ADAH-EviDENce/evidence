import * as React from "react";
import {Collapse, Card, CardBody, CardHeader} from "reactstrap";
import FontAwesome from 'react-fontawesome';

interface QueryDocumentProps {
    id: string;
}

class QueryDocument extends React.Component<QueryDocumentProps, any> {
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
                    <CardHeader className="" onClick={this.toggle}>
                        <button className="btn btn-primary btn-sm float-right stretched-link">
                            <FontAwesome name='plus-square-o' />
                            &nbsp;
                            <span>Snippets</span>
                        </button>
                        {this.props.id}
                    </CardHeader>
                    <Collapse isOpen={this.state.collapse}>
                        <CardBody>
                            Anim pariatur cliche reprehenderit,
                            enim eiusmod high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident.
                        </CardBody>
                    </Collapse>

                </Card>
            </div>
        );
    }
}

export default QueryDocument;