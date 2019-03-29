import * as React from "react";
import MainHeader from "./MainHeader";
import './Page.css';

const Fragment = React.Fragment;

class Page extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Fragment>
                <div className="container page-container">
                    <div className="row page-header">
                        <div className="col-12">
                            <MainHeader/>
                        </div>
                    </div>
                    <div className="rows page-body">
                        <div className="offset-2 col-8">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Page;