import * as React from "react";
import Page from "../common/Page";
import {AppContext} from "../AppContext";
import './ConfigPage.css';
import {Alert} from "reactstrap";
import UserForm from "./UserForm";
import ConfigForm from "./ConfigForm";
import ConfigBtns from "./ConfigBtns";
import IconWarning from "../common/IconWarning";

class ConfigPage extends React.Component<any, any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const selectUserWarning = this.context.user
            ? null
            : <> (verplicht) <IconWarning/></>;

            return (
            <Page>
                <h2>Instellingen</h2>
                <Alert color='info'>
                    Instellingen worden alleen in huidige pagina van de browser opgeslagen.
                </Alert>

                <div className="card">
                    <div className="card-header">
                        <h4>Gebruiker{selectUserWarning}</h4>
                    </div>
                    <div className="card-block">
                        <UserForm/>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-header">
                        <h4>Zoeken en beoordelen</h4>
                    </div>
                    <div className="card-block">
                        <ConfigForm/>
                    </div>
                </div>

                <ConfigBtns/>

            </Page>
        );
    }
}

export default ConfigPage;
