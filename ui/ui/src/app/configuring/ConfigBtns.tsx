import React from "react";
import {AppContext} from "../AppContext";
import {withRouter} from "react-router-dom";

class ConfigBtns extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        return <div className="float-right mt-3 mb-3">
            <button
                onClick={() => this.props.history.goBack()}
                className="search btn btn-sm btn-success mr-3"
                disabled={!this.context.user}
            >
                <i className='fa fa-chevron-left'/>
                &nbsp;
                Back
            </button>
            <button
                onClick={() => this.props.history.push("/search/")}
                className="search btn btn-sm btn-success"
                disabled={!this.context.user}
            >
                Search
                &nbsp;
                <i className='fa fa-chevron-right'/>
            </button>
        </div>;
    }
}

ConfigBtns.contextType = AppContext;

export default withRouter(ConfigBtns);
