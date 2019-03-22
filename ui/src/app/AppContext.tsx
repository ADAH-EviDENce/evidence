import * as React from "react";

export type AppContextType = {
    search: string,
    updateSearch(s: string): void,
};

export const AppContext = React.createContext<AppContextType>({
    search: "",
    updateSearch: (s) => {
        throw new Error('updateSearch() not implemented');
    },
});