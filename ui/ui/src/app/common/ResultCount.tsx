import * as React from "react";
import './ResultCount.css';

interface ResultCountProps {
    count: number
}
class ResultCount extends React.Component<ResultCountProps, any> {
    render() {
        return (
            <p className="result-count">In total {this.props.count} results:</p>
        );
    }
}

export default ResultCount;
