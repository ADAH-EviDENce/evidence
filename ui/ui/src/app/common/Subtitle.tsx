import * as React from "react";
import {ReactNode} from "react";

interface SubtitleProps {
    text: ReactNode
}
class Subtitle extends React.Component<SubtitleProps, any> {
    render() {
        return (
            <p className="small text-center text-muted">{this.props.text}</p>
        );
    }
}

export default Subtitle;