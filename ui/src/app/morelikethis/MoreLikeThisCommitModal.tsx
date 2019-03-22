import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import FontAwesome from "react-fontawesome";

interface MoreLikeThisCommitModalProps {
    snippetId: string,
    documentId: string,
    answers: Array<any>,
    committed: boolean
}

class MoreLikeThisCommitModal extends React.Component<MoreLikeThisCommitModalProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {modal: false};
    }

    onQuery() {
        console.log('onQuery');
    }

    render() {
        if(!this.props.committed) {
            return null;
        }

        return (
            <div className="more-like-this-commit-modal">
                <Modal isOpen={this.props.committed}>
                    <ModalHeader>Keuzemenu</ModalHeader>
                    <ModalBody>
                        <FontAwesome name='spinner' spin/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.onQuery}>Beoordeel meer fragmenten</Button>
                        <Button color="success" onClick={this.onQuery}>Zoek nieuwe documenten</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default MoreLikeThisCommitModal;