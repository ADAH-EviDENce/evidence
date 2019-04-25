import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import InfoBox from "../common/InfoBox";
import FontAwesome from "react-fontawesome";
import {AppContext} from "../AppContext";
import SearchSnippetList from "./SearchSnippetList";
import SearchPagination from "./SearchPagination";
import config from "../../config";
import {withRouter} from "react-router";

class Search extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            search: "",
            page: 1,
            size: config.SEARCH_RESULTS_SIZE,
            snippets: null,
            total: 0,
            loading: false
        };
        this.updateContext();
    }

    /**
     * 1. Update context, 2. Handle search
     * (See componentWillReceiveProps)
     */
    private updateContext() {
        let search = this.props.match.params.search;
        this.context.updateContext({search});
    }

    componentWillReceiveProps(nextProps: any) {
        const newSearch = nextProps.match.params.search;
        if (newSearch !== this.state.search) {
            if (newSearch) {
                this.setState({search: newSearch, page: 1, loading: true}, () => {
                    this.handleSearch(newSearch);
                });
            } else {
                this.setState({search: newSearch, page: 1, loading: false});
            }
        }
    }

    handleSearch = (query: string) => {
        const from = (this.state.page - 1) * this.state.size;
        Resources.searchSnippets(query, from, this.state.size).then((json) => {
            this.setState({snippets: json, total: json.hits.total, loading: false});
        }).catch((data) => {
            this.setState({loading: false, error: 'Could not fetch snippets with provided query.'});
        });
    };

    private renderSnippetList() {
        if (!this.state.snippets && !this.state.loading) {
            return null;
        }
        const lastPage = Math.ceil(this.state.total / this.state.size);
        return this.state.loading
            ?
            <FontAwesome name='spinner' spin/>
            :
            <>
                <p>{this.state.total} resultaten (pagina {this.state.page} van {lastPage})</p>
                <SearchSnippetList snippets={this.state.snippets.hits.hits}/>
                <SearchPagination
                    page={this.state.page}
                    lastPage={lastPage}
                    onPrevious={() => this.handlePageChange(-1)}
                    onNext={() => this.handlePageChange(+1)}
                />
            </>;
    }

    private handlePageChange(delta: number) {
        this.setState(
            {page: this.state.page + delta},
            () => this.handleSearch(this.state.search)
        );
    }

    render() {
        return (
            <Page>
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <span>
                    <SearchBar defaultSearch={this.state.search}/>
                    {this.renderSnippetList()}
                </span>
            </Page>
        );
    }
}

Search.contextType = AppContext;

export default withRouter(Search);