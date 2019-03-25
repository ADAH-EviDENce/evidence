import './App.css';
import * as React from "react";
import Routes from "./Routes";
import {AppContextProvider} from "./AppContext";

export default class App extends React.Component<any, any> {

    readonly state = {
        search: ""
    };

    updateSearch = (s: string) => this.setState({search: s});

    render() {
        return (
            <AppContextProvider
                value={{
                    search: this.state.search,
                    updateSearch: this.updateSearch,
                }}
            >
                <div className="app">
                    <Routes/>
                </div>
            </AppContextProvider>
        );
    }
}

