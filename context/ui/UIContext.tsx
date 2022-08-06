import { createContext } from "react";

interface ContextProps {
  isMenuOpen: boolean;

  //   Methods
  toggleSideMenu: () => void;
}

export const UIContext = createContext({} as ContextProps);
