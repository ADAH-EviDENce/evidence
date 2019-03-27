import * as React from "react";
import {Link} from "react-router-dom";

class MainHeader extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="main-header">
                <h1>Evidence</h1>
            </div>
        );
    }
}

export default MainHeader;