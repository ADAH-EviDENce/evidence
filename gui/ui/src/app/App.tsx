import './App.css';
import * as React from "react";
import Routes from "./Routes";
import {AppContext, initAppContext} from "./AppContext";

export default class App extends React.Component<any, any> {

    updateContext = (c: object) => this.setState(c);

    /**
     * use copy of initAppContext but with an implementation of updateContext
     */
    readonly state = Object.assign({}, initAppContext, {updateContext: this.updateContext});

    render() {
        return (
            <AppContext.Provider
                value={Object.assign({}, this.state)}
            >
                <div className="app">
                    <Routes/>
                </div>
            </AppContext.Provider>
        );
    }
}

