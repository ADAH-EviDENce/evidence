import * as React from "react";
import {AppContext, AppContextConsumer, AppContextType} from "../AppContext";

interface SearchBtnProps {
    search: string
}


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
            this.setSearch(this.context);
        }
    };

    setSearch = (consumer: AppContextType) => {
        consumer.updateContext({search: this.props.search});
    };

    render() {
        return (
            <AppContextConsumer>{consumer =>
                <button className="btn btn-outline-secondary" onClick={() => {
                    this.setSearch(consumer);
                }}>
                    Zoek snippets
                </button>
            }</AppContextConsumer>
        );

    }
}

SearchBtn.contextType = AppContext;

export default SearchBtn;