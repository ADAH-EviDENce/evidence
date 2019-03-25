import * as React from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {RouteComponentProps, withRouter} from "react-router";
import {AppContextConsumer} from "../AppContext";
import {MORE_LIKE_THIS_SIZE} from "../../config";

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
        let nextFrom = this.props.from + MORE_LIKE_THIS_SIZE;
        this.props.history.push(`/documents/${did}/snippets/${sid}/from/${nextFrom}/`);
    };

    onSearch = () => {
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
                        <AppContextConsumer>{context =>
                            <p className="d-none">{context.search}</p>
                        }</AppContextConsumer>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.onQuery}>Beoordeel meer fragmenten</Button>
                        <Button color="success" onClick={this.onSearch}>Zoek nieuwe documenten</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default withRouter(MoreLikeThisCommitModal);