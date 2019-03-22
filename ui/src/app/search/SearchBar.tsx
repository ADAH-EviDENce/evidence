import * as React from "react";

class SearchBar extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {search: ""};
    }

    onSearchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({search: e.target.value});
    };

    onClick = () => {
        this.props.onSearch(this.state.search);
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
                            <button className="btn btn-outline-secondary" onClick={this.onClick}>Zoek documenten</button>
                        </div>
                    </div>
                    <small id="help" className="form-text text-muted">Voorbeeldzoekterm: <code>documents/document/_search</code></small>
                </div>
            </div>
        );
    }
}

export default SearchBar;

