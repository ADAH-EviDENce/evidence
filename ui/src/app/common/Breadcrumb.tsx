import * as React from "react";
import {Link} from "react-router-dom";

export interface BreadcrumbProps {
    path: string,
    text: any
    current?: boolean
}

class Breadcrumb extends React.Component<BreadcrumbProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return <Link
            to={this.props.path}
            className={`${!!this.props.current ? 'active btn-link disabled ' : ''}breadcrumb-item`}
        >
            {this.props.text}
        </Link>;
    }
}

export default Breadcrumb;