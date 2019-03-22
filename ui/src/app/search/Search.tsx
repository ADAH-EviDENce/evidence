import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import DocumentList from "../document/DocumentList";
import {AppContext} from "../AppContext";
import FontAwesome from "react-fontawesome";

interface SearchProps {
    search: string
}

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            search: "",
            documents: null,
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
        if (this.state.documents) {

        }
        Resources.getDocuments(query).then((data) => {
            if (!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({documents: json, loading: false});
            });

        }).catch((data) => {
            this.setState({loading: false, error: 'Could not fetch documents with provided query.'});
        });
    };

    private renderDocumentList() {
        return this.state.loading
            ?
            <FontAwesome name='spinner' spin/>
            :
            <DocumentList documents={this.state.documents}/>;
    }

    render() {
        return (
            <Page>
                <div className="offset-2 col-8">
                    <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                    <span>
                        <AppContext.Consumer>{appContext =>
                            <SearchBar defaultSearch={appContext.search}/>
                        }</AppContext.Consumer>
                        {this.renderDocumentList()}
                    </span>
                </div>
            </Page>
        );
    }
}

export default Search;