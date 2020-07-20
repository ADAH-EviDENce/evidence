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
            return <>No users selected yet</>;
        }
        const search = this.context.moreLikeThisType;
        const rocchio = this.context.useRocchio ? 'rocchio' : 'no rocchio';
        return <>{`Logged in as ${user} (${search}, ${rocchio})`}</>;
    }
}

ConfigSummary.contextType = AppContext;

export default ConfigSummary;
