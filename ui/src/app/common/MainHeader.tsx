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
                    <Link className="nav-item" to={"/search/"}>
                        <i className="fas fa-search"/> zoeken
                    </Link>
                    <Link className="nav-item" to={"/seedset/"}>
                        <i className="fas fa-seedling"/> startset
                    </Link>
                    <Link className="nav-item" to={"/positive/1/"}>
                        <i className="fas fa-check-double"/> resultaten
                    </Link>
                    <Link className="nav-item" to={"/data/"}>
                        <i className="fas fa-table"/> data
                    </Link>
                    <Button color="link" className="nav-item" onClick={() => this.props.openConfig()}>
                        <i className="fas fa-cog"/> instellingen
                    </Button>
                </div>
            </div>
        );
    }
}

export default MainHeader;