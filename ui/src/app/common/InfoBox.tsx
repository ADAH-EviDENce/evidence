import * as React from "react";
import './InfoBox.css';

/**
 * Show msg as alert
 * When onClose sets msg to null, the box is hidden
 */
interface InfoBoxProps {
    msg: any,
    type: "info" | "warning"
    onClose?: Function
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
                {this.props.onClose !== undefined
                    ?
                    <button type="button" className="close" aria-label="Close" onClick={() => this.props.onClose ? this.props.onClose() : null}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    :
                    null
                }
                {this.props.type == 'info'
                    ?
                    <span className="fa-stack fa-sm mt-1" style={{"verticalAlign": "top"}}>
                        <i className='fa fa-circle-thin fa-stack-2x'/>
                        <i className='fa fa-info fa-stack-1x'/>
                    </span>
                    :
                    <span className="fa-stack fa-sm mt-1" style={{"verticalAlign": "top"}}>
                        <i className='fa fa-circle-thin fa-stack-2x'/>
                        <i className='fa fa-exclamation fa-stack-1x'/>
                    </span>
                }
                &nbsp;
                &nbsp;
                <span className="mt-1">{this.props.msg}</span>
            </div>
        );
    }
}

export default InfoBox;