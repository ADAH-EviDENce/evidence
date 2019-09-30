import * as React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Search from "./search/Search";
import MoreLikeThisPage from "./morelikethis/MoreLikeThisPage";
import DocumentPage from "./document/DocumentPage";
import DataPage from "./data/DataPage";
import {AppContext} from "./AppContext";

class Routes extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        // add pathname as key to force instantiation of new component when path changes
        const pathname = this.props.location.pathname;

        return (
            <Switch>
                <Redirect exact from="/" to="/search/"/>
                <Route exact path='/data/' component={DataPage} key={pathname}/>
                <Route exact path='/documents/:did/' component={DocumentPage} key={pathname}/>
                <Route exact path='/documents/:did/snippets/:sid/from/:from/' component={MoreLikeThisPage} key={pathname}/>
                <Route exact path='/search/' component={Search} key={pathname}/>
                <Route exact path='/search/:search/' component={Search} key={pathname}/>
            </Switch>
        );
    }
}
Routes.contextType = AppContext;

export default withRouter(Routes);