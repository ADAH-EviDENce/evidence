import * as React from "react";
import Breadcrumb, {BreadcrumbProps} from "./Breadcrumb";
import './BreadcrumbTrail.css';

interface BreadcrumbTrailProps {
    trail: BreadcrumbProps[]
}

class BreadcrumbTrail extends React.Component<BreadcrumbTrailProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return <nav aria-label="breadcrumb">
            <div className="breadcrumb page-breadcrumb">
                {this.props.trail ? this.props.trail.map((bc: any, i: number) => {
                    if (!bc.text)
                        return null;
                    return <Breadcrumb key={i} path={bc.path} text={bc.text} current={(i + 1) === this.props.trail.length}/>;
                }) : null}
            </div>
        </nav>;
    }
}

export default BreadcrumbTrail;