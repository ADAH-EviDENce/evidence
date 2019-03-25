import * as React from "react";

type AppContextType = {
    search: string,
    updateSearch(s: string): void,
};

export const AppContext = React.createContext<AppContextType>({
    search: "",
    updateSearch: (s) => {throw new Error('updateSearch() not implemented')},
});

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;