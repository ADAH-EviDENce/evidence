import './App.css';
import * as React from "react";
import Routes from "./Routes";

class App extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {"search": ""};
    }

    render() {
        return (
            <div className="app">
                <Routes/>
            </div>
        );
    }
}

export default App;
