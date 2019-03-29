import './App.css';
import * as React from "react";
import Routes from "./Routes";
import {AppContextProvider} from "./AppContext";
import config from "../config";

export default class App extends React.Component<any, any> {

    readonly state = {
        search: "",
        moreLikeThisType: config.MORE_LIKE_THIS_TYPE
    };

    updateContext = (c: object) => this.setState(c);

    render() {
        return (
            <AppContextProvider
                value={{
                    search: this.state.search,
                    moreLikeThisType: this.state.moreLikeThisType,
                    updateContext: this.updateContext
                }}
            >
                <div className="app">
                    <Routes/>
                </div>
            </AppContextProvider>
        );
    }
}

