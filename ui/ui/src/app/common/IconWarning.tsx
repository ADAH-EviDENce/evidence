import * as React from "react";

class IconWarning extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        return <i className="fa fa-exclamation-triangle text-primary" />;
    }
}

export default IconWarning;