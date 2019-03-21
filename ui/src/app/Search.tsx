import * as React from "react";
import SearchBar from "./SearchBar";
import Page from "./Page";
import DocumentResource from "./DocumentResource";
import ErrorBox from "./common/ErrorBox";
import QueryDocumentList from "./QueryDocumentList";

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
                console.log(json);
                this.setState({documents: json});
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
                    <QueryDocumentList documents={this.state.documents}/>
                </div>
            </Page>
        );
    }
}

export default Search;