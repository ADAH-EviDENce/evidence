import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import './ConfirmModal.css';

type ConfirmModalProps = {
    onContinue: Function,
    onCancel: Function,
    isOpen: boolean,
    msg: string
}

class ConfirmModal extends React.Component<ConfirmModalProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {modal: false};
    }

    render() {
        return (
            <div className="confirm-modal">
                <Modal isOpen={this.props.isOpen}>
                    <ModalBody>
                        <span className="confirm-modal-p">
                            <p>{this.props.msg}</p>
                            <p>Are you sure?</p>
                        </span>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="outline-secondary" onClick={() => this.props.onCancel()}>No</Button>
                        <Button color="danger" onClick={() => this.props.onContinue()}>Yes</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default ConfirmModal;
