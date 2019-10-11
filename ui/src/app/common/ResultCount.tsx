import * as React from "react";
import './ResultCount.css';

interface ResultCountProps {
    count: number
}
class ResultCount extends React.Component<ResultCountProps, any> {
    render() {
        return (
            <p className="result-count">In totaal {this.props.count} resultaten:</p>
        );
    }
}

export default ResultCount;