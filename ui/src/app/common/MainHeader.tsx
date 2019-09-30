import * as React from "react";
import {Link} from "react-router-dom";
import './MainHeader.css';

class MainHeader extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="main-header">
                    <Link className="navbar-brand" to="/">Evidence</Link>
                    <Link className="nav-item" to={"/search/"}>zoeken</Link>
                    <Link className="nav-item" to={"/config/"}>instellingen</Link>
                    <Link className="nav-item" to={"/data/"}>data</Link>
            </div>
        );
    }
}

export default MainHeader;