import * as React from "react";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import Resources from "../Resources";
import queryString from "query-string";
import {withRouter} from "react-router";
import config from "../../config";
import SnippetList from "../snippet/SnippetList";
import PositiveSnippet from "./PositiveSnippet";

class PositivePage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        const params = queryString.parse(this.props.location.search);

        this.state = {
            snippets: [],
            loading: true,
            from: params.from ? params.from: 0,
            size: params.size ? params.size : config.POSITIVE_SIZE
        };

        this.getSnippets();
    }

    private getSnippets() {
        Resources.getPositive(
            this.context.user,
            this.state.from,
            this.state.size
        ).then((data) => {
            if(!data) {
                this.setState({loading: false});
                return;
            }
            data.json().then((positiveIds) => {
                const docIds = positiveIds.map((id: string) => {return {_id: id}});
                Resources.getSnippetsByIds(docIds).then((snippets) => {
                    this.setState({loading: false, snippets: snippets.docs});
                });
            });
        }).catch(() => {
            this.setState({loading: false, error: 'Er trad een fout op tijdens het ophalen van de resultaten'});
        });
    }

    private renderSnippets() {
        return <SnippetList>
            {!this.state.loading && this.state.snippets.map((s: any, i: number) => {
                return <PositiveSnippet
                    key={i}
                    id={s._id}
                    documentId={s._source.document}
                    text={s.highlight ? s.highlight.text[0] : s._source.text}
                />
            })}
        </SnippetList>
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

PositivePage.contextType = AppContext;

export default withRouter(PositivePage);