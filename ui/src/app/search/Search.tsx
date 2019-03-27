import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import FontAwesome from "react-fontawesome";
import {AppContextConsumer} from "../AppContext";
import SearchSnippetList from "./SearchSnippetList";

interface SearchProps {
    search: string
}

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            search: "",
            snippets: null,
            loading: false
        };
    }

    componentWillReceiveProps(nextProps: SearchProps) {
        if (nextProps.search !== this.state.search) {
            this.setState({search: nextProps.search, loading: true}, () => {
                this.handleSearch(nextProps.search);
            });
        }
    }

    handleSearch = (query: string) => {
        Resources.searchSnippets(query, 0).then((json) => {
            this.setState({snippets: json, loading: false});
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
            <SearchSnippetList snippets={this.state.snippets.hits.hits}/>;
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