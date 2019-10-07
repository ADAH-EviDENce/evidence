import * as React from "react";
import Page from "../common/Page";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import Resources from "../Resources";
import {withRouter} from "react-router";
import config from "../../config";
import SnippetList from "../snippet/SnippetList";
import PositiveSnippet from "./PositiveSnippet";
import FivePagePagination from "../common/FivePagePagination";

class PositivePage extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            snippets: [],
            loading: true,
            loadingTotal: true,
            total: 0,
            page: this.props.match.params.page,
            size: config.POSITIVE_SIZE
        };

        this.getTotalSnippets();
        this.getSnippets();
    }

    private getTotalSnippets() {
        Resources.getPositiveTotal(
            this.context.user
        ).then((response) => {
            response.text().then((totalResults) => {
                const totalPages = Math.ceil(parseInt(totalResults) / this.state.size);
                this.setState({loadingTotal: false, total: totalPages})
            });
        }).catch(() => {
            this.setState({loadingTotal: false, error: 'Fout bij ophalen aantal resultaten'});
        });
    }

    private getSnippets() {
        const size = this.state.size;
        const page = this.state.page;
        const from = (page - 1) * size;

        console.log('from:', from, 'size:', size, 'page:', page);
        Resources.getPositive(
            this.context.user,
            from,
            size
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
            this.setState({loading: false, error: 'Fout bij ophalen van resultaten'});
        });
    }

    handlePageClick = (page: number) => {
        const url = `/positive/${page}/`;
        console.log(url);
        this.props.history.push(url);
    };

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

    private renderPagination() {
        if(this.state.loading || this.state.loadingTotal) {
            return null;
        }
        return <FivePagePagination
            page={this.state.page}
            total={this.state.total}
            onPageClick={this.handlePageClick}
        />;
    }

    render() {
        return (
            <Page>
                <h2>Resultaten</h2>
                <p className="text-center text-muted">Alle positief beoordeelde fragmenten, inclusief de startset</p>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <InfoBox msg={this.state.info} type="info" onClose={() => this.setState({info: null})}/>

                {this.renderSnippets()}
                {this.renderPagination()}

            </Page>
        );
    }
}

PositivePage.contextType = AppContext;

export default withRouter(PositivePage);