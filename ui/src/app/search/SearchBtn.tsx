import * as React from "react";
import {withRouter} from "react-router";

class SearchBtn extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            enterClicked: false
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleEnterKeyPress, false);
    }

    handleEnterKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.setSearch();
        }
    };

    setSearch = () => {
        this.props.history.push(`/search/${this.props.search}/`);
    };

    render() {
        return (
                <button className="btn btn-outline-secondary" onClick={() => {
                    this.setSearch();
                }}>
                    Zoek fragmenten
                </button>
        );

    }
}

export default withRouter(SearchBtn);