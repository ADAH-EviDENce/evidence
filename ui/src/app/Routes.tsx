import * as React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Search from "./Search";

class Routes extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const pathname = this.props.location.pathname;

        return (
            <Switch>
                <Redirect exact from="/" to="/search" key={pathname}/>

                <Route exact path='/search' component={Search}/>

            </Switch>
        );
    }
}

export default withRouter(Routes);