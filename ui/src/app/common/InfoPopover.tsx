import * as React from "react";
import {Button, Popover, PopoverBody} from "reactstrap";

class InfoPopover extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    private showInfo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.setState({popoverOpen: !this.state.popoverOpen});
    };

    render() {
        return <>
            <Button id="PopoverClick" color="link" onClick={this.showInfo}>
              <span className="fa-stack fa-sm">
                <i className='far fa-circle fa-stack-2x'/>
                <i className='fas fa-info fa-stack-1x'/>
              </span>
            </Button>
            <Popover isOpen={this.state.popoverOpen} trigger="click" placement="top" target="PopoverClick">
                <PopoverBody>{this.props.children}</PopoverBody>
            </Popover>
        </>;
    }
}

export default InfoPopover;