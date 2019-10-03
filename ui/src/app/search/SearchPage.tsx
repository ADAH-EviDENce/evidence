import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import InfoBox from "../common/InfoBox";
import {AppContext} from "../AppContext";
import SearchSnippetList from "./SearchSnippetList";
import config from "../../config";
import {withRouter} from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../common/Spinner";

class SearchPage extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            search: "",
            page: 1,
            size: config.SEARCH_RESULTS_SIZE,
            snippets: [],
            total: 0,
            searching: true
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
                this.setState({search: newSearch, page: 1, searching: true}, () => {
                    this.handleSearch(newSearch);
                });
            } else {
                this.setState({search: newSearch, page: 1});
            }
        }
    }

    handleSearch = (query: string) => {
        const from = (this.state.page - 1) * this.state.size;
        Resources.searchSnippets(query, from, this.state.size).then((json: any) => {

            this.setState({
                snippets: this.state.snippets.concat(json.hits.hits),
                total: json.hits.total,
                searching: false
            });
        }).catch(() => {
            this.setState({
                error: 'Er konden geen fragmenten gevonden worden op basis van de opgegeven zoektermen.',
                searching: false
            });
        });
    };

    private handlePageChange = () => {
        this.setState(
            {page: this.state.page + 1},
            () => this.handleSearch(this.state.search)
        );
    };

    render() {
        const breadcrumbTrail = this.context.search ? [
            {text: "zoeken", path: "/search/"},
            {text: this.context.search, path: `/search/${this.context.search}/`}
        ] : undefined;

        return (
            <Page
                breadcrumbTrail={breadcrumbTrail}
            >
                <InfoBox msg={this.state.error} type="warning" onClose={() => this.setState({error: null})}/>
                <SearchBar defaultSearch={this.state.search}/>
                {this.renderTable()}
            </Page>
        );
    }

    private renderTable() {
        if(this.state.searching) {
            return null;
        }
        return (
            <>
                <p>{this.state.total} resultaten</p>
                <InfiniteScroll
                    dataLength={this.state.snippets.length}
                    next={this.handlePageChange}
                    hasMore={this.state.total > this.state.snippets.length}
                    loader={<Spinner/>}
                >
                    <SearchSnippetList snippets={this.state.snippets}/>
                </InfiniteScroll>
            </>
        )
    }
}

SearchPage.contextType = AppContext;

export default withRouter(SearchPage);