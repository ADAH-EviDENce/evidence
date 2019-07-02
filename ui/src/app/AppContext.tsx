import * as React from "react";
import {MoreLikeThisType} from "./configuring/MoreLikeThisType";
import config from "../config";

export type AppContextType = {
    search: string,
    moreLikeThisType: MoreLikeThisType,
    moreLikeThisSize: number,
    useRocchio: boolean,
    updateContext(c: object): void
};

export const initAppContext = {
    search: "",
    user: null,
    moreLikeThisType: config.MORE_LIKE_THIS_TYPE,
    moreLikeThisSize: config.MORE_LIKE_THIS_SIZE,
    useRocchio: config.USE_ROCCHIO,
    updateContext: (c: object) => {throw new Error('updateContext() not implemented')}
};

export const AppContext = React.createContext<AppContextType>(initAppContext);
