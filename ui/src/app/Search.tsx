import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "./Page";
import DocumentResource from "./DocumentResource";
import ErrorBox from "./common/ErrorBox";

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleSearch = (query: string) => {
        DocumentResource.getDocuments(query).then((data) => {
            if(!data.ok) {
                throw Error("Status " + data.status);
            }
            data.json().then((json) => {
                this.setState({documents: JSON.stringify(json, null, 2)});
            });
        }).catch((data) => {
            this.setState({error: 'Could not fetch documents with provided query.'});
        });
    };

    closeErrorMsg = ()  => {
        this.setState({error: null});
    };

    render() {
        return (
            <Page>
                <div className="offset-2 col-8">
                    <ErrorBox error={this.state.error} onClose={this.closeErrorMsg}/>
                    <SearchBar onSearch={this.handleSearch}/>
                    <pre>{this.state.documents}</pre>
                </div>
            </Page>
        );
    }
}

export default Search;