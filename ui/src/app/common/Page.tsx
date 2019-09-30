import * as React from "react";
import MainHeader from "./MainHeader";
import './Page.css';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {CrumbProps} from "./Crumb";
import Breadcrumb from "./Breadcrumb";

const Fragment = React.Fragment;

type PageProps = RouteComponentProps & {
    breadcrumbTrail?: CrumbProps[]
}

class Page extends React.Component<PageProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Fragment>
                <nav className="navbar sticky-top navbar-light bg-light">
                    <div className="container">
                        <div className="offset-2 col-8">
                            <MainHeader/>
                        </div>

                    </div>
                </nav>
                <div className="container page-container">
                    <div className="rows page-body">
                        <div className="offset-2 col-8">
                            {this.props.breadcrumbTrail ? <Breadcrumb trail={this.props.breadcrumbTrail}/> : null}
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Page);