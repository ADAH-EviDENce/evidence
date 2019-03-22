import * as React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Search from "./search/Search";
import MoreLikeThis from "./morelikethis/MoreLikeThis";

class Routes extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const pathname = this.props.location.pathname;

        return (
            <Switch>
                <Redirect exact from="/" to="/search/" key={pathname}/>

                <Route exact path='/search/' component={Search}/>

                <Route exact path='/documents/:did/snippets/:sid/' component={MoreLikeThis}/>

            </Switch>
        );
    }
}

export default withRouter(Routes);