import * as React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Search from "./search/Search";
import MoreLikeThis from "./morelikethis/MoreLikeThis";
import {AppContext} from "./AppContext";

class Routes extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const pathname = this.props.location.pathname;

        return (
            <AppContext.Consumer>{appContext => appContext && (
                <Switch>
                    <Redirect exact from="/" to="/search/" key={pathname}/>
                    <Route exact path='/search/' render={() => (<Search search={appContext.search}/>)}/>
                    <Route exact path='/documents/:did/snippets/:sid/' component={MoreLikeThis}/>
                </Switch>
            )}</AppContext.Consumer>
        );
    }
}

export default withRouter(Routes);