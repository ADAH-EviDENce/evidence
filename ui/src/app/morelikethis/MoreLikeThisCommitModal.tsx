import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";

type MoreLikeThisCommitModalProps = RouteComponentProps & {
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

    onQuery = () => {
        console.log('onQuery');
    };

    onSearch = () => {
        console.log('search');
        this.props.history.push(`/search/`);
    };

    render() {
        if(!this.props.committed) {
            return null;
        }

        return (
            <div className="more-like-this-commit-modal">
                <Modal isOpen={this.props.committed}>
                    <ModalHeader>Keuzemenu</ModalHeader>
                    <ModalBody>
                        Uw antwoorden zijn opgeslagen.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.onQuery} disabled>Beoordeel meer fragmenten</Button>
                        <Button color="success" onClick={this.onSearch}>Zoek nieuwe documenten</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default withRouter(MoreLikeThisCommitModal);