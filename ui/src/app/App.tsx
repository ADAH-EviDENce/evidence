import './App.css';
import * as React from "react";
import Routes from "./Routes";
import {AppContextProvider} from "./AppContext";

export default class App extends React.Component<any, any> {

    readonly state = {
        search: ""
    };

    updateContext = (c: object) => this.setState(c);

    render() {
        return (
            <AppContextProvider
                value={{
                    search: this.state.search,
                    updateContext: this.updateContext,
                }}
            >
                <div className="app">
                    <Routes/>
                </div>
            </AppContextProvider>
        );
    }
}

