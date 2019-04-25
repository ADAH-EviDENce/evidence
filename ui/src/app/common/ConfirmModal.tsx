import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";

type ConfirmModalProps = {
    onContinue: Function,
    onCancel: Function,
    isOpen: boolean
}

class ConfirmModal extends React.Component<ConfirmModalProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {modal: false};
    }

    render() {
        return (
            <div className="more-like-this-commit-modal">
                <Modal isOpen={this.props.isOpen}>
                    <ModalBody>
                        Weet u het zeker?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.props.onCancel()}>Nee</Button>
                        <Button color="danger" onClick={() => this.props.onContinue()}>Ja</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default ConfirmModal;