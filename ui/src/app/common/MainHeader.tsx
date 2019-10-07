import * as React from "react";
import {Link} from "react-router-dom";
import './MainHeader.css';
import {Button} from "reactstrap";

interface MainHeaderProps {
    openConfig: Function,
}

class MainHeader extends React.Component<MainHeaderProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div className="main-header">
                <h1><Link to="/">Evidence</Link></h1>
                <div className="main-nav text-center">
                    <Link className="nav-item" to={"/search/"}>zoeken</Link>
                    <Link className="nav-item" to={"/seedset/"}>startset</Link>
                    <Link className="nav-item" to={"/positive/1/"}>resultaten</Link>
                    <Link className="nav-item" to={"/data/"}>data</Link>
                    <Button color="link" className="nav-item" onClick={() => this.props.openConfig()}>instellingen</Button>
                </div>
            </div>
        );
    }
}

export default MainHeader;