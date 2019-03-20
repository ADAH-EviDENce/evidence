import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "./Page";
import DocumentResource from "./DocumentResource";

class Search extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    handleSearch = (query: string) => {
        DocumentResource.getDocuments(query).then((data) => {
            data.json().then((json) => {
                this.setState({documents: JSON.stringify(json, null, 2)});
            });
        });
    };

    render() {
        return (
            <Page>
                <div className="offset-2 col-8">
                    <SearchBar onSearch={this.handleSearch}/>
                    <pre>{this.state.documents}</pre>
                </div>
            </Page>
        );
    }
}

export default Search;