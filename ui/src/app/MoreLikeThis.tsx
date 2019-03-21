import * as React from "react";
import Page from "./common/Page";
import ErrorBox from "./common/ErrorBox";

class MoreLikeThis extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Page>
                <div className="offset-2 col-8">
                    <div className="more-like-this">
                        <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                        {this.props.match.params.did} - {this.props.match.params.sid}
                    </div>
                </div>
            </Page>
        );
    }
}

export default MoreLikeThis;