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

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEnterKeyPress, false)
    }

    handleEnterKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && this.props.location.pathname.startsWith('/search')) {
            event.preventDefault();
            this.setSearch();
        }
    };

    setSearch = () => {
        const query = this.props.search ? this.props.search + '/' : '';
        this.props.history.push(`/search/${query}`);
    };

    render() {
        return (
                <button className="btn btn-outline-secondary" onClick={() => {
                    this.setSearch();
                }}>
                    Search fragments
                </button>
        );

    }
}

export default withRouter(SearchBtn);
