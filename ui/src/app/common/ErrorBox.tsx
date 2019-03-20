import * as React from "react";
import './ErrorBox.css';

class ErrorBox extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        console.log(this.props);
        if (!this.props.error) {
            return null;
        }
        return (
            <div className="alert alert-warning error-box">
                <button type="button" className="close" aria-label="Close" onClick={() => this.props.onClose()}>
                    <span aria-hidden="true">&times;</span>
                </button>
                {this.props.error}
            </div>
        );
    }
}

export default ErrorBox;