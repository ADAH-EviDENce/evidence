import * as React from "react";
import {AppContext} from "../AppContext";

interface SearchBtnProps {
    search: string
}

export const SearchBtn: React.FunctionComponent<SearchBtnProps> = (props) => {
    const {updateSearch} = React.useContext(AppContext);

    return (
        <>
            <button className="btn btn-outline-secondary" onClick={() => {
                updateSearch(props.search)
            }}>
                Zoek documenten
            </button>
        </>
    );
};
