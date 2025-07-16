// src/redux/MenuProvider.tsx
import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../redux/store';
import { fetchMenuData } from '../redux/actions/menuActions';

interface MenuContextProps {
  loading: boolean;
  error: string | null;
  refreshMenu: () => void;
}

const MenuContext = createContext<MenuContextProps>({} as MenuContextProps);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.menu);

  // Fetch data only once on mount
  useEffect(() => {
    dispatch(fetchMenuData());
  }, [dispatch]); // Empty dependency array ensures it runs only once

  const refreshMenu = () => {
    dispatch(fetchMenuData());
  };

  return (
    <MenuContext.Provider value={{ loading, error, refreshMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
};