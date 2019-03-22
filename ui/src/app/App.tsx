import './App.css';
import * as React from "react";
import Routes from "./Routes";
import {AppContext} from "./AppContext";

class App extends React.Component<any, any> {
    readonly state = {
        search: ""
    };

    updateSearch = (s: string) => {
        this.setState({
            search: s
        });
    };

    render() {
        return (
            <AppContext.Provider
                value={{
                    search: this.state.search,
                    updateSearch: this.updateSearch
                }}
            >
                <div className="app">
                    <Routes/>
                </div>
            </AppContext.Provider>
        );
    }
}

export default App;
