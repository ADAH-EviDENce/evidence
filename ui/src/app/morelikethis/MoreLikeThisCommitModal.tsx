import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";
import {AppContext} from "../AppContext";
import config from "../../config";
import ReadableId from "../common/ReadableId";

type MoreLikeThisCommitModalProps = RouteComponentProps & {
    documentId: string,
    snippetId: string,
    from: number,
    answers: Array<any>,
    committed: boolean
}

class MoreLikeThisCommitModal extends React.Component<MoreLikeThisCommitModalProps, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {modal: false};
    }

    onQuery = () => {
        let sid = this.props.snippetId;
        let did = this.props.documentId;
        let nextFrom = this.props.from + this.context.moreLikeThisSize;
        this.props.history.push(`/documents/${did}/snippets/${sid}/from/${nextFrom}/`);
    };

    onDocument = () => {
        this.props.history.push(`/documents/${this.props.documentId}/`);
    };

    onSearch = () => {
        const query = this.context.search ? this.context.search + '/' : '';
        this.props.history.push(`/search/${query}`);
    };

    render() {
        if (!this.props.committed) {
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
                        <Button color="success" onClick={this.onQuery}>Beoordeel meer fragmenten</Button>
                        <Button color="success" onClick={this.onDocument}>Terug naar document</Button>
                        <Button color="success" onClick={this.onSearch}>Zoek nieuw document</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

MoreLikeThisCommitModal.contextType = AppContext;

export default withRouter(MoreLikeThisCommitModal);