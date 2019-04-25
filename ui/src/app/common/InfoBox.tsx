import * as React from "react";
import './InfoBox.css';

/**
 * Show msg as alert, box is hidden when no msg
 */
interface InfoBoxProps {
    msg: string,
    type: "info" | "warning"
    onClose: Function
}

class InfoBox extends React.Component<InfoBoxProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        if (!this.props.msg) {
            return null;
        }
        return (
            <div className={`alert alert-${this.props.type} info-box`}>
                <button type="button" className="close" aria-label="Close" onClick={() => this.props.onClose()}>
                    <span aria-hidden="true">&times;</span>
                </button>
                {this.props.msg}
            </div>
        );
    }
}

export default InfoBox;