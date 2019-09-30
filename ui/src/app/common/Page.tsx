import * as React from "react";
import MainHeader from "./MainHeader";
import './Page.css';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {CrumbProps} from "./Crumb";
import Breadcrumb from "./Breadcrumb";
import ConfigSummary from "../configuring/ConfigSummary";
import ConfigModal from "../configuring/ConfigModal";
import {AppContext} from "../AppContext";

const Fragment = React.Fragment;

type PageProps = RouteComponentProps & {
    breadcrumbTrail?: CrumbProps[]
}

class Page extends React.Component<PageProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            configModal: !this.context.user
        };
    }

    render() {

        return (
            <Fragment>
                <nav id="page-navbar" className="navbar sticky-top navbar-light bg-light">
                    <div className="container">
                        <div className="col-10">
                            <div className="float-right">
                                <small className="text-muted"><ConfigSummary/></small>
                            </div>
                        </div>
                    </div>
                </nav>
                <ConfigModal isOpen={this.state.configModal} onClose={() => this.setState({configModal: false})}/>
                <div className="row page-header">
                    <div className="col-12">
                        <MainHeader openConfig={() => this.setState({configModal: true})}/>
                    </div>
                </div>
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

Page.contextType = AppContext;

export default withRouter(Page);