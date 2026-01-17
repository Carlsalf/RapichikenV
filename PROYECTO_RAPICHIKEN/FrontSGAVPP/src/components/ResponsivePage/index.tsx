import {Header} from "../Header";
import {ReactNode, useEffect, useMemo, useReducer, useState} from "react";
import {SideBar} from "../SideBar";
import {ResponsivePageContext, responsivePageReducer} from "./context";
import {User} from "../../types/User";
import {useInventory} from "../../hooks/inventory/useInventory";

type ResponsivePageProps = {
    children: ReactNode;
    user?: User;
}

export const ResponsivePage = ({ children, user }: ResponsivePageProps) => {
    const [state, dispatch] = useReducer(responsivePageReducer, { user, isLogged: false, isEmployee: false, inventories: [] });
    const [checkUser, setCheckUser] = useState(true);
    const [showSideBar, setShowSideBar] = useState(false);
    const { inventories } = useInventory();

    const contextValue = useMemo(() => ({ ...state, dispatch }), [state]);

    useEffect(() => {
        if (checkUser && user && user !== state.user) {
            const isEmployee = user.role.id !== 3;
            setShowSideBar(isEmployee);
            dispatch({ type: 'SET_USER', user, isLogged: true, isEmployee });
        }
    }, [user, state.user, checkUser]);

    useEffect(() => {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
            const user = JSON.parse(userRaw) as User;

            if (user) {
                const isEmployee = user.role.id !== 3;
                setCheckUser(false);
                setShowSideBar(isEmployee);
                dispatch({ type: 'SET_USER', user, isLogged: true, isEmployee });
            }
        }
    }, []);

    useEffect(() => {
        if (inventories.length) {
            const availableInventories = inventories.filter(inventory => inventory.disponible);
            console.info('inventory', availableInventories);
            dispatch({ type: 'SET_INVENTORIES', inventories: availableInventories });
        }
    }, [inventories]);

  return (
      <ResponsivePageContext.Provider value={contextValue}>
          <div>
            <Header />
            <div className='d-flex'>
                {showSideBar && <SideBar />}
                <div className='container-fluid'>
                    {children}
                </div>
            </div>
          </div>
      </ResponsivePageContext.Provider>
  );
}
