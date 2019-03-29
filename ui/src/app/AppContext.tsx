import * as React from "react";
import {MoreLikeThisType} from "./configuring/MoreLikeThisType";

export type AppContextType = {
    search: string,
    moreLikeThisType: MoreLikeThisType,
    updateContext(c: object): void
};

export const AppContext = React.createContext<AppContextType>({
    search: "",
    moreLikeThisType: MoreLikeThisType.ES,
    updateContext: (c) => {throw new Error('updateContext() not implemented')}
});

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;