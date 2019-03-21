import * as React from "react";

class MainHeader extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="main-header">
                <h1>Evidence</h1>
                <div className="main-nav text-center">
                    <a className="nav-item" href="/">home</a>
                    <a className="nav-item" href="/">over</a>
                    <a className="nav-item" href="/">link3</a>
                </div>
            </div>
        );
    }
}

export default MainHeader;