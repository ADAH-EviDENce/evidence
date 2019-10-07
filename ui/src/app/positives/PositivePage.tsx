import * as React from "react";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";

export default class PositivePage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    private renderSnippets() {
        console.log('I exist!');
    }

    render() {
        return (
            <Page>
                <h2>Resultaten</h2>
                <p className="text-center text-muted">Alle positief beoordeelde fragmenten, inclusief de startset</p>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <InfoBox msg={this.state.info} type="info" onClose={() => this.setState({info: null})}/>

                {this.renderSnippets()}
            </Page>
        );
    }
}
