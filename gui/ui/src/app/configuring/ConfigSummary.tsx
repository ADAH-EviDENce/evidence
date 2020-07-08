import * as React from "react";
import {AppContext} from "../AppContext";

class ConfigSummary extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {};
    }

    render() {
        const user = this.context.user;
        if(!user) {
            return <>Nog geen gebruiker geselecteerd</>;
        }
        const search = this.context.moreLikeThisType;
        const rocchio = this.context.useRocchio ? 'rocchio' : 'geen rocchio';
        return <>{`Ingelogd als ${user} (${search}, ${rocchio})`}</>;
    }
}

ConfigSummary.contextType = AppContext;

export default ConfigSummary;