import * as React from "react";
import {AppContext} from "../AppContext";
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import UserForm from "./UserForm";
import ConfigForm from "./ConfigForm";
import IconWarning from "../common/IconWarning";
import './ConfigModal.css';

interface ConfigModalProps {
    isOpen: boolean,
    onClose: Function
}

class ConfigModal extends React.Component<ConfigModalProps, any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    render() {
        const selectUserWarning = this.context.user
            ? null
            : <> (verplicht) <IconWarning/></>;

            return (<>
                <Modal className="config-modal" size="lg" isOpen={this.props.isOpen} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="text-center">Instellingen</ModalHeader>
                    <ModalBody>

                        <Alert color='info'>
                            Instellingen worden alleen in huidige pagina van de browser opgeslagen.
                        </Alert>

                        <div className="card">
                            <div className="card-header">
                                Gebruiker{selectUserWarning}
                            </div>
                            <div className="card-block">
                                <UserForm/>
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-header">
                                Zoeken en beoordelen
                            </div>
                            <div className="card-block">
                                <ConfigForm/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="float-right mt-3 mb-3">
                            <button
                                onClick={() => this.props.onClose()}
                                className="search btn btn-sm btn-success"
                                disabled={!this.context.user}
                            >
                                <i className="fa fa-check"/>
                                Sluiten
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>

            </>
        );
    }
}

export default ConfigModal;
