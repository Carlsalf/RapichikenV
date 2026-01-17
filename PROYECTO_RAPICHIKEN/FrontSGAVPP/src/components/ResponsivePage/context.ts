import {createContext, Dispatch, useCallback, useContext} from 'react';
import {User} from "../../types/User";
import {Inventory} from "../../types/Inventario";

type ResponsivePageState = {
    user: User | undefined;
    isLogged: boolean;
    isEmployee: boolean;
    inventories: Inventory[];
};

type ResponsivePageActionType = {
    type: 'SET_USER';
    user: User | undefined;
    isLogged: boolean;
    isEmployee: boolean;
} | { type: 'SET_INVENTORIES', inventories: Inventory[] };

export type ResponsivePageContextValue = ResponsivePageState & {
  dispatch: (action: ResponsivePageActionType) => void;
};

export const responsivePageReducer = (state: ResponsivePageState, action: ResponsivePageActionType) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user,
                isLogged: action.isLogged,
                isEmployee: action.isEmployee,
            };
        case "SET_INVENTORIES":
            return {
                ...state,
                inventories: action.inventories,
            };
        default:
            return state;
    }
}

export const ResponsivePageContext = createContext<ResponsivePageContextValue>({} as ResponsivePageContextValue);

export const useResponsivePageContext = () => useContext(ResponsivePageContext);

export const useResponsivePageDispatch = () => {
    const { dispatch } = useContext(ResponsivePageContext);

    const setUser = useCallback((user: User | undefined, isLogged: boolean, isEmployee: boolean) => {
        dispatch({ type: "SET_USER", user, isLogged, isEmployee })
    }, [dispatch]);

    return {
        setUser,
    };
};
