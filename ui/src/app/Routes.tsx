import * as React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Search from "./search/Search";
import MoreLikeThis from "./morelikethis/MoreLikeThis";
import {AppContextConsumer} from "./AppContext";

class Routes extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        // add pathname as key to force instantiation of new component when path changes
        const pathname = this.props.location.pathname;

        return (
            <AppContextConsumer>{context =>
                <Switch>
                    <Redirect exact from="/" to="/search/"/>
                    <Route exact path='/search/' render={() => (<Search search={context.search}/>)} key={pathname}/>
                    <Route exact path='/documents/:did/snippets/:sid/from/:from/' component={MoreLikeThis} key={pathname}/>
                </Switch>
            }</AppContextConsumer>
        );
    }
}

export default withRouter(Routes);