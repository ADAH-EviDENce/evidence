import * as React from "react";
import {AppContext} from "../AppContext";
import {Alert, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import UserForm from "./UserForm";
import ConfigForm from "./ConfigForm";
import IconWarning from "../common/IconWarning";
import './ConfigModal.css';

interface ConfigModalProps {
    isOpen: boolean,
    onClose: Function
}

class ConfigModal extends React.Component<ConfigModalProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            modal: false,
            formContext: JSON.parse(JSON.stringify(this.context))
        };
    };

    updateContext = () => {
        this.context.updateContext(this.state.formContext);
        this.props.onClose();
    };

    private updateFormContext = (updatedContextField : any) => {
        const formContext = Object.assign({}, this.state.formContext, updatedContextField);
        this.setState({formContext});
    };

    render() {
        const selectUserWarning = this.context.user
            ? null
            : <> (mandatory) <IconWarning/></>;

            return (<>
                <Modal className="config-modal" size="lg" isOpen={this.props.isOpen} >
                    <ModalHeader className="text-center">Settings</ModalHeader>
                    <ModalBody>

                        <Alert color='info'>
                            Settings are only saved in current page of the browser.
                        </Alert>

                        <div className="card">
                            <div className="card-header">
                                User{selectUserWarning}
                            </div>
                            <div className="card-block">
                                <UserForm
                                    formContext={this.state.formContext}
                                    updateFormContext={this.updateFormContext}
                                />
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-header">
                                Search and assess relevance
                            </div>
                            <div className="card-block">
                                <ConfigForm
                                    formContext={this.state.formContext}
                                    updateFormContext={this.updateFormContext}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="float-right mt-3 mb-3">
                            <button
                                onClick={this.updateContext}
                                className="search btn btn-sm btn-success"
                                disabled={!this.state.formContext.user}
                            >
                                <i className="fa fa-check"/>
                                Close
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>

            </>
        );
    }
}

ConfigModal.contextType = AppContext;

export default ConfigModal;
