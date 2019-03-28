import * as React from "react";

export type AppContextType = {
    search: string,
    updateContext(c: object): void
};

export const AppContext = React.createContext<AppContextType>({
    search: "",
    updateContext: (c) => {throw new Error('updateContext() not implemented')}
});

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;