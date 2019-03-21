import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "../common/Page";
import Resources from "../Resources";
import ErrorBox from "../common/ErrorBox";
import DocumentList from "../document/DocumentList";

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleSearch = (query: string) => {
        Resources.getDocuments(query).then((data) => {
            if(!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({documents: json});
            });
        }).catch((data) => {
            this.setState({error: 'Could not fetch documents with provided query.'});
        });
    };

    render() {
        return (
            <Page>
                <div className="offset-2 col-8">
                    <ErrorBox error={this.state.error} onClose={() => this.setState({error: null})}/>
                    <SearchBar onSearch={this.handleSearch}/>
                    <DocumentList documents={this.state.documents}/>
                </div>
            </Page>
        );
    }
}

export default Search;