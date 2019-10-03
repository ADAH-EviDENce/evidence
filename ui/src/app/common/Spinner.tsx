import * as React from "react";
import FontAwesome from "react-fontawesome";

export default class Spinner extends React.Component<any, any> {
    render() {
        return <p className="text-center mt-3"><FontAwesome name='spinner' spin/></p>;
    }
}