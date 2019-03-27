import * as React from "react";
import {AppContext} from "../AppContext";

interface SearchBtnProps {
    search: string
}

export const SearchBtn: React.FunctionComponent<SearchBtnProps> = (props) => {
    const {updateContext} = React.useContext(AppContext);

    return (
        <>
            <button className="btn btn-outline-secondary" onClick={() => {
                updateContext({search: props.search})
            }}>
                Zoek snippets
            </button>
        </>
    );
};
