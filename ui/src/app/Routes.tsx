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
        // add key to force instantiation of new component when path or context changes
        const key = this.props.location.pathname + JSON.stringify(this.context);

        return (
            <Switch>
                <Redirect exact from="/" to="/search/"/>
                <Route exact path='/data/' component={DataPage} key={key}/>
                <Route exact path='/documents/:did/' component={DocumentPage} key={key}/>
                <Route exact path='/documents/:did/snippets/:sid/from/:from/' component={MoreLikeThisPage} key={key}/>
                <Route exact path='/search/' component={Search} key={key}/>
                <Route exact path='/search/:search/' component={Search} key={key}/>
            </Switch>
        );
    }
}
Routes.contextType = AppContext;

export default withRouter(Routes);