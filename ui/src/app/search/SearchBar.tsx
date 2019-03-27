import * as React from "react";
import {SearchBtn} from "./SearchBtn";

interface SearchBarProps {
    defaultSearch: string,
}

class SearchBar extends React.Component<SearchBarProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {search: this.props.defaultSearch};
    }

    onSearchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({search: e.target.value});
    };

    render() {
        return (
            <div className="search-bar">
                <div className="form-group text-center">
                    <div className="input-group mb-3">
                        <input className="form-control"
                               id="main-search-query"
                               placeholder="Zoekterm"
                               value={this.state.search}
                               onChange={this.onSearchUpdate}/>
                        <div className="input-group-append">
                            <SearchBtn search={this.state.search}/>
                        </div>
                    </div>
                    <small
                        id="help"
                        className="form-text text-muted"
                    >
                        Bijvoorbeeld: <code>geweld AND pantser</code>
                    </small>
                </div>
            </div>
        );
    }
}

export default SearchBar;

