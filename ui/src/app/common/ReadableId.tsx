import * as React from "react";

interface ReadableIdProps {
    id: string,
    toRemove?: string,
    lowercase?: boolean
}

class ReadableId extends React.Component<ReadableIdProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const toDisplay = this.props.toRemove
            ?
            this.props.id.replace(this.props.toRemove, '')
            :
            this.props.id;

        let readable = toDisplay.replace(/_/g, ' ');

        readable = readable.trim();

        if(this.props.lowercase) {
            readable = readable.toLowerCase();
        }

        readable = readable.replace('conversation clipped 150 ', '');

        return (
            <span className="readable-id">{readable}</span>
        );
    }
}

export default ReadableId;