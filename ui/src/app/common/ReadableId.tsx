import * as React from "react";

interface ReadableIdProps {
  id: string
  toRemove?: string
}

class ReadableId extends React.Component<ReadableIdProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const toDisplay = this.props.toRemove
            ?
            this.props.id.replace(this.props.toRemove, '[..]')
            :
            this.props.id;

        const readable = toDisplay.replace(/_/g, ' ');
        return (
            <span className="readable-id">{readable}</span>
        );
    }
}

export default ReadableId;