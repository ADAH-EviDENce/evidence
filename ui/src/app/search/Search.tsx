import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import FontAwesome from "react-fontawesome";
import {AppContextConsumer} from "../AppContext";
import SearchSnippetList from "./SearchSnippetList";
import SearchPagination from "./SearchPagination";
import {SEARCH_RESULTS_SIZE} from "../../config";

interface SearchProps {
    search: string
}

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            search: "",
            page: 1,
            size: SEARCH_RESULTS_SIZE,
            snippets: null,
            total: 0,
            loading: false
        };
    }

    componentWillReceiveProps(nextProps: SearchProps) {
        if (nextProps.search !== this.state.search) {
            this.setState({search: nextProps.search, page: 1, loading: true}, () => {
                this.handleSearch(nextProps.search);
            });
        }
    }

    handleSearch = (query: string) => {
        Resources.searchSnippets(query, (this.state.page - 1) * this.state.size, this.state.size).then((json) => {
            this.setState({snippets: json, total: json.hits.total, loading: false});
        }).catch((data) => {
            this.setState({loading: false, error: 'Could not fetch snippets with provided query.'});
        });
    };

    private renderSnippetList() {
        if (!this.state.snippets && !this.state.loading) {
            return null;
        }
        return this.state.loading
            ?
            <FontAwesome name='spinner' spin/>
            :
            <>
                <p>{this.state.total} resultaten gevonden</p>
                <SearchSnippetList snippets={this.state.snippets.hits.hits}/>
                <SearchPagination
                    page={this.state.page}
                    lastPage={Math.ceil(this.state.total/this.state.size)}
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
                <div className="offset-2 col-8">
                    <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                    <span>
                        <AppContextConsumer>{context =>
                            <SearchBar defaultSearch={context.search}/>
                        }</AppContextConsumer>
                        {this.renderSnippetList()}
                    </span>
                </div>
            </Page>
        );
    }
}

export default Search;