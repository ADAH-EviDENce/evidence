import * as React from "react";
import {AppContext} from "../AppContext";
import Resources from "../Resources";
import Page from "../common/Page";
import Spinner from "../common/Spinner";
import InfoBox from "../common/InfoBox";
import SeedSnippetList from "./SeedSnippetList";
import Subtitle from "../common/Subtitle";
import ResultCount from "../common/ResultCount";

class SeedSetPage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            loading: true,
            snippets: []
        };
        Resources.getSeedSet(this.context.user).then((dataIds) => {
            dataIds.json().then(jsonIds => {
                if (!jsonIds) {
                    this.setState({snippets: [], info: "U heeft nog geen fragmenten geselecteerd", loading: false});
                    return;
                }
                const ids = jsonIds.map((id: string) => {return {_id: id}});
                Resources.getSnippetsByIds(ids).then((jsonSnippets) => {
                    this.setState({snippets: jsonSnippets.docs, loading: false});
                });
            });
        }).catch(() => {
            this.setState({
                error: "Er trad een fout op bij het ophalen van de geselecteerde fragmenten",
                loading: false
            });
        });
    }

    private renderSnippets() {
        if (this.state.error) {
            return;
        }
        if(this.state.loading) {
                return <Spinner/>;
        }
        return <>
            <ResultCount count={this.state.snippets.length}/>
            <SeedSnippetList snippets={this.state.snippets} onDeselect={(id: string) => this.handleDeselect(id)}/>
        </>;
    }

    private handleDeselect(id: string) {
        Resources.removeSeedId(this.context.user, id).then(() => {
            const index = this.state.snippets.findIndex((s: any) => s._id === id);
            this.state.snippets.splice(index, 1);
            this.setState({snippets: this.state.snippets});
        });
    }

    render() {
        return (
            <Page>
                <h2>Startset</h2>
                <Subtitle text={<>Eerste selectie fragmenten om beoordeling mee te beginnen</>} />

                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <InfoBox msg={this.state.info} type="info" onClose={() => this.setState({info: null})}/>

                {this.renderSnippets()}
            </Page>
        );
    }
}

SeedSetPage.contextType = AppContext;

export default SeedSetPage;